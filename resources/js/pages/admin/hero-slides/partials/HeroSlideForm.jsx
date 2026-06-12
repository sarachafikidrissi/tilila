import React from 'react';
import { AlertCircle, Plus, Trash2, GripVertical, X } from 'lucide-react';
import { normalizePathPrefix } from '@/components/HeroCarousel';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

function emptyTri() {
    return { en: '', fr: '', ar: '' };
}

function emptyCta() {
    return { label: emptyTri(), url: '', style: 'primary', is_active: true };
}

function getXsrfToken() {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function formatFileSize(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileNameFromPath(path) {
    if (!path) return 'video';
    return path.split('/').pop() || 'video';
}

function resolveUploadErrorMessage(status, responseText, fileSizeBytes) {
    const trimmed = (responseText || '').trim();
    const fileSizeMb = (fileSizeBytes / 1024 / 1024).toFixed(1);

    if (trimmed.startsWith('{')) {
        try {
            const response = JSON.parse(trimmed);
            if (response.message) {
                return response.message;
            }
        } catch {
            // not JSON — fall through
        }
    }

    const lower = trimmed.toLowerCase();
    const looksTooLarge =
        status === 413 ||
        lower.includes('request entity too large') ||
        lower.includes('payload too large') ||
        lower.includes('content too large') ||
        lower.includes('exceeds the maximum') ||
        lower.includes('upload_max_filesize') ||
        lower.includes('post_max_size');

    if (looksTooLarge) {
        return `File too large for server limits (${fileSizeMb} MB). Increase PHP upload_max_filesize and post_max_size, and your web server's body size limit.`;
    }

    if (status === 419) {
        return 'Session expired. Refresh the page and try again.';
    }

    if (status === 401 || status === 403) {
        return 'You are not authorized to upload videos.';
    }

    if (status === 0) {
        return `Upload failed — connection interrupted. If the file is large (${fileSizeMb} MB), it may exceed server upload limits.`;
    }

    if (status >= 500) {
        return 'Server error while uploading. Try a smaller file or check the server logs.';
    }

    if (!trimmed && status >= 400) {
        return `File too large for server limits (${fileSizeMb} MB). The server rejected the upload before it could be processed.`;
    }

    return 'Upload failed. Please try again.';
}

function captureVideoPosterFrame(videoUrl) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';

        const cleanup = () => {
            video.removeAttribute('src');
            video.load();
        };

        const fail = () => {
            cleanup();
            resolve(null);
        };

        video.addEventListener('error', fail, { once: true });

        video.addEventListener(
            'loadeddata',
            () => {
                const seekTime = video.duration >= 1 ? 1 : 0.1;

                const onSeeked = () => {
                    video.removeEventListener('seeked', onSeeked);

                    if (!video.videoWidth || !video.videoHeight) {
                        fail();
                        return;
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        fail();
                        return;
                    }

                    try {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    } catch {
                        fail();
                        return;
                    }

                    canvas.toBlob(
                        (blob) => {
                            cleanup();
                            if (!blob) {
                                resolve(null);
                                return;
                            }
                            resolve(
                                new File([blob], `poster-${Date.now()}.jpg`, {
                                    type: 'image/jpeg',
                                }),
                            );
                        },
                        'image/jpeg',
                        0.8,
                    );
                };

                video.addEventListener('seeked', onSeeked);
                video.currentTime = seekTime;
            },
            { once: true },
        );

        video.src = videoUrl;
    });
}

function uploadVideoFile(file, { onProgress, onComplete, onError, signal }) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('video', file);
    const startTime = Date.now();
    let aborted = false;

    const cleanup = () => {
        if (signal) {
            signal.removeEventListener('abort', handleAbort);
        }
    };

    const handleAbort = () => {
        aborted = true;
        xhr.abort();
    };

    if (signal) {
        if (signal.aborted) {
            onError('cancelled');
            return;
        }
        signal.addEventListener('abort', handleAbort);
    }

    xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        let estimatedSecondsRemaining = null;
        if (event.loaded > 0 && elapsedSeconds > 0) {
            const rate = event.loaded / elapsedSeconds;
            estimatedSecondsRemaining = Math.min(
                9999,
                Math.round((event.total - event.loaded) / rate),
            );
        }
        onProgress(
            percent,
            event.loaded,
            event.total,
            estimatedSecondsRemaining,
        );
    };

    xhr.onload = () => {
        cleanup();
        if (aborted) return;
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.path) {
                    onComplete(response.path);
                    return;
                }
            } catch {
                // fall through to resolved error
            }
            onError(
                resolveUploadErrorMessage(
                    xhr.status,
                    xhr.responseText,
                    file.size,
                ),
            );
            return;
        }
        onError(
            resolveUploadErrorMessage(xhr.status, xhr.responseText, file.size),
        );
    };

    xhr.onerror = () => {
        cleanup();
        if (aborted) return;
        onError(
            resolveUploadErrorMessage(xhr.status, xhr.responseText, file.size),
        );
    };

    xhr.onabort = () => {
        cleanup();
        onError('cancelled');
    };

    xhr.open('POST', '/admin/hero-slides/upload-video');
    xhr.setRequestHeader('X-XSRF-TOKEN', getXsrfToken());
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(formData);
}

function TriLangInputs({
    idPrefix,
    label,
    value,
    onChange,
    required = false,
    requiredAll = false,
    error,
    errors,
}) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <div className="grid gap-3 sm:grid-cols-3">
                {['en', 'fr', 'ar'].map((lang) => {
                    const langError = errors?.[lang];
                    return (
                        <div key={lang} className="space-y-1.5">
                            <Label htmlFor={`${idPrefix}-${lang}`}>
                                {lang.toUpperCase()}
                                {requiredAll || (required && lang === 'en')
                                    ? ' *'
                                    : ''}
                            </Label>
                            <Input
                                id={`${idPrefix}-${lang}`}
                                value={value?.[lang] ?? ''}
                                onChange={(e) =>
                                    onChange({
                                        ...(value ?? {}),
                                        [lang]: e.target.value,
                                    })
                                }
                            />
                            {langError && <InputError message={langError} />}
                        </div>
                    );
                })}
            </div>
            {error && <InputError message={error} />}
        </div>
    );
}

function TriLangTextareas({ idPrefix, label, value, onChange }) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <div className="grid gap-3 sm:grid-cols-3">
                {['en', 'fr', 'ar'].map((lang) => (
                    <div key={lang} className="space-y-1.5">
                        <Label htmlFor={`${idPrefix}-${lang}`}>
                            {lang.toUpperCase()}
                        </Label>
                        <textarea
                            id={`${idPrefix}-${lang}`}
                            className={cn(
                                'flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground',
                                'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                            )}
                            value={value?.[lang] ?? ''}
                            onChange={(e) =>
                                onChange({
                                    ...(value ?? {}),
                                    [lang]: e.target.value,
                                })
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function HeroSlideForm({
    mode = 'create',
    data,
    setData,
    errors,
    submitLabel = 'Save',
    processing = false,
    onSubmit,
}) {
    const isVideoOnLoad = (data.media_type ?? 'image') === 'video';
    const [coverMode, setCoverMode] = React.useState(() => {
        if (mode !== 'edit' || !isVideoOnLoad) {
            return null;
        }
        return data.image_url ? 'custom' : 'auto';
    });
    const [imagePreview, setImagePreview] = React.useState(
        data.image_url ?? null,
    );
    const [posterSource, setPosterSource] = React.useState(() => {
        if (isVideoOnLoad && data.image_url) {
            return 'existing';
        }
        return null;
    });
    const [videoUploadState, setVideoUploadState] = React.useState(() => {
        if (
            (data.media_type ?? 'image') === 'video' &&
            data.video_url &&
            data.video_path
        ) {
            return {
                status: 'complete',
                fileName: fileNameFromPath(data.video_path),
                fileSize: null,
                previewUrl: data.video_url,
            };
        }
        return null;
    });
    const videoInputRef = React.useRef(null);
    const posterInputRef = React.useRef(null);
    const pendingVideoFileRef = React.useRef(null);
    const previewObjectUrlRef = React.useRef(null);
    const manualPosterRef = React.useRef(
        mode === 'edit' && isVideoOnLoad
            ? Boolean(data.image_url)
            : false,
    );
    const posterSourceRef = React.useRef(posterSource);
    const coverModeRef = React.useRef(coverMode);
    const captureGenerationRef = React.useRef(0);

    React.useEffect(() => {
        posterSourceRef.current = posterSource;
    }, [posterSource]);

    React.useEffect(() => {
        coverModeRef.current = coverMode;
    }, [coverMode]);

    const revokePreviewObjectUrl = React.useCallback(() => {
        if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current);
            previewObjectUrlRef.current = null;
        }
    }, []);

    React.useEffect(() => {
        return () => {
            revokePreviewObjectUrl();
        };
    }, [revokePreviewObjectUrl]);

    const isVideoMedia = (data.media_type ?? 'image') === 'video';
    const hasVideoSource = Boolean(
        data.video_url || data.video_path || videoUploadState,
    );
    const showCoverModeChoice = mode === 'edit' && isVideoMedia && hasVideoSource;
    const useAutoCover =
        mode === 'create' || (mode === 'edit' && coverMode === 'auto');

    const getVideoPreviewUrl = React.useCallback(() => {
        if (previewObjectUrlRef.current) {
            return previewObjectUrlRef.current;
        }
        if (videoUploadState?.previewUrl) {
            return videoUploadState.previewUrl;
        }
        return data.video_url ?? null;
    }, [data.video_url, videoUploadState]);

    const applyPosterFile = React.useCallback(
        (file, source) => {
            setData('image', file);
            setPosterSource(source);
            posterSourceRef.current = source;
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        },
        [setData],
    );

    const tryAutoCapturePoster = React.useCallback(
        (previewUrl, captureGeneration) => {
            if (mode === 'edit' && coverModeRef.current !== 'auto') {
                return;
            }
            if (manualPosterRef.current) {
                return;
            }

            captureVideoPosterFrame(previewUrl).then((file) => {
                if (
                    !file ||
                    manualPosterRef.current ||
                    (mode === 'edit' && coverModeRef.current !== 'auto') ||
                    captureGeneration !== captureGenerationRef.current
                ) {
                    return;
                }

                applyPosterFile(file, 'auto');
            });
        },
        [applyPosterFile, mode],
    );

    const regenerateAutoCover = React.useCallback(() => {
        const videoUrl = getVideoPreviewUrl();
        if (!videoUrl) {
            return;
        }

        manualPosterRef.current = false;
        const captureGeneration = ++captureGenerationRef.current;
        tryAutoCapturePoster(videoUrl, captureGeneration);
    }, [getVideoPreviewUrl, tryAutoCapturePoster]);

    const handleCoverModeChange = (value) => {
        if (!value) {
            return;
        }

        setCoverMode(value);

        if (value === 'auto') {
            manualPosterRef.current = false;
            regenerateAutoCover();
            return;
        }

        manualPosterRef.current = true;
        if (posterSourceRef.current === 'auto') {
            setData('image', null);
            setImagePreview(data.image_url ?? null);
            setPosterSource(data.image_url ? 'existing' : null);
            posterSourceRef.current = data.image_url ? 'existing' : null;
        }
    };

    React.useEffect(() => {
        if (
            mode !== 'edit' ||
            coverMode !== 'auto' ||
            !isVideoMedia ||
            imagePreview ||
            data.image
        ) {
            return;
        }

        regenerateAutoCover();
    }, [mode, coverMode, isVideoMedia, imagePreview, data.image, regenerateAutoCover]);

    const startVideoUpload = React.useCallback(
        (file) => {
            pendingVideoFileRef.current = file;
            const previewUrl = URL.createObjectURL(file);
            revokePreviewObjectUrl();
            previewObjectUrlRef.current = previewUrl;
            const abortController = new AbortController();
            const captureGeneration = ++captureGenerationRef.current;

            if (
                posterSourceRef.current === 'auto' ||
                (mode === 'edit' && coverModeRef.current === 'auto')
            ) {
                setData('image', null);
                setImagePreview(null);
                setPosterSource(null);
                posterSourceRef.current = null;
            }

            setData('video_path', null);
            setVideoUploadState({
                status: 'uploading',
                percent: 0,
                fileName: file.name,
                fileSize: file.size,
                estimatedSeconds: null,
                abortController,
            });

            tryAutoCapturePoster(previewUrl, captureGeneration);

            uploadVideoFile(file, {
                signal: abortController.signal,
                onProgress: (
                    percent,
                    _loaded,
                    _total,
                    estimatedSecondsRemaining,
                ) => {
                    setVideoUploadState((prev) =>
                        prev?.status === 'uploading'
                            ? {
                                  ...prev,
                                  percent,
                                  estimatedSeconds: estimatedSecondsRemaining,
                              }
                            : prev,
                    );
                },
                onComplete: (path) => {
                    setVideoUploadState({
                        status: 'complete',
                        fileName: file.name,
                        fileSize: file.size,
                        previewUrl,
                    });
                    setData('video_path', path);
                },
                onError: (message) => {
                    if (message === 'cancelled') {
                        revokePreviewObjectUrl();
                        pendingVideoFileRef.current = null;
                        setVideoUploadState(null);
                        if (videoInputRef.current) {
                            videoInputRef.current.value = '';
                        }
                        return;
                    }
                    setVideoUploadState({
                        status: 'error',
                        fileName: file.name,
                        fileSize: file.size,
                        message,
                    });
                },
            });
        },
        [revokePreviewObjectUrl, setData, tryAutoCapturePoster, mode],
    );

    const handleMediaTypeChange = (value) => {
        if (!value) return;
        setData('media_type', value);
        if (value === 'image') {
            if (videoUploadState?.status === 'uploading') {
                videoUploadState.abortController.abort();
            }
            revokePreviewObjectUrl();
            pendingVideoFileRef.current = null;
            setVideoUploadState(null);
            setData('video_path', null);
            manualPosterRef.current = false;
            setPosterSource(null);
            posterSourceRef.current = null;
            setCoverMode(null);
            coverModeRef.current = null;
            if (videoInputRef.current) {
                videoInputRef.current.value = '';
            }
        } else {
            setData('image', null);
            setImagePreview(data.image_url ?? null);
            if (mode === 'edit') {
                const nextCoverMode = data.image_url ? 'custom' : 'auto';
                setCoverMode(nextCoverMode);
                coverModeRef.current = nextCoverMode;
                manualPosterRef.current = nextCoverMode === 'custom';
            } else if (data.image_url) {
                manualPosterRef.current = true;
                setPosterSource('existing');
                posterSourceRef.current = 'existing';
            } else {
                manualPosterRef.current = false;
                setPosterSource(null);
                posterSourceRef.current = null;
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        manualPosterRef.current = true;
        applyPosterFile(file, 'manual');
    };

    const handlePosterChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        manualPosterRef.current = true;
        applyPosterFile(file, 'manual');
        if (posterInputRef.current) {
            posterInputRef.current.value = '';
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        startVideoUpload(file);
    };

    const handleCancelVideoUpload = () => {
        if (videoUploadState?.status === 'uploading') {
            videoUploadState.abortController.abort();
        }
    };

    const handleChangeVideo = () => {
        revokePreviewObjectUrl();
        pendingVideoFileRef.current = null;
        setVideoUploadState(null);
        setData('video_path', null);
        ++captureGenerationRef.current;
        if (
            posterSourceRef.current === 'auto' ||
            (mode === 'edit' && coverModeRef.current === 'auto')
        ) {
            setData('image', null);
            setImagePreview(null);
            setPosterSource(null);
            posterSourceRef.current = null;
        }
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    const handleRetryVideoUpload = () => {
        if (pendingVideoFileRef.current) {
            startVideoUpload(pendingVideoFileRef.current);
        }
    };

    const handleRemoveVideoError = () => {
        pendingVideoFileRef.current = null;
        setVideoUploadState(null);
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    const isUploading = videoUploadState?.status === 'uploading';
    const needsVideo =
        isVideoMedia && videoUploadState === null && !data.video_path;
    const saveDisabled = processing || isUploading || needsVideo;

    let saveButtonLabel = submitLabel;
    if (isUploading) {
        saveButtonLabel = 'Waiting for upload…';
    } else if (needsVideo) {
        saveButtonLabel = 'Select a video to continue';
    } else if (processing) {
        saveButtonLabel = 'Saving…';
    }

    const isBanner = data.display_mode === 'banner_image';
    const isNormal = !isBanner;
    const normalizedPathPrefix = normalizePathPrefix(data.path_prefix || null);

    // CTA helpers
    const addCta = () => setData('ctas', [...(data.ctas ?? []), emptyCta()]);
    const removeCta = (i) =>
        setData(
            'ctas',
            (data.ctas ?? []).filter((_, idx) => idx !== i),
        );
    const updateCta = (i, patch) =>
        setData(
            'ctas',
            (data.ctas ?? []).map((c, idx) =>
                idx === i ? { ...c, ...patch } : c,
            ),
        );

    const KNOWN_SLIDE_KEYS = [
        'home',
        'about',
        'tililab',
        'tilila',
        'gouvernance',
        'experts',
        'events',
        'opportunities',
        'media',
    ];

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-6"
            encType="multipart/form-data"
        >
            {/* Identity */}
            <Card>
                <CardHeader>
                    <CardTitle>Identity</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="slide_key">
                                Slide key{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="slide_key"
                                value={data.slide_key ?? ''}
                                onChange={(e) =>
                                    setData('slide_key', e.target.value)
                                }
                                disabled={mode === 'edit'}
                                placeholder="e.g. experts"
                            />
                            {mode === 'edit' && (
                                <p className="text-xs text-muted-foreground">
                                    The slide key cannot be changed after
                                    creation — it is the routing anchor.
                                </p>
                            )}
                            {KNOWN_SLIDE_KEYS.includes(data.slide_key ?? '') &&
                                mode === 'edit' && (
                                    <p className="text-xs text-amber-600">
                                        This is a built-in slide key. Deleting
                                        this slide will blank the hero on its
                                        route.
                                    </p>
                                )}
                            <InputError message={errors?.slide_key} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Sort order</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                min="0"
                                value={data.sort_order ?? 0}
                                onChange={(e) =>
                                    setData(
                                        'sort_order',
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="path_prefix">Page URL prefix</Label>
                        <Input
                            id="path_prefix"
                            value={data.path_prefix ?? ''}
                            onChange={(e) => {
                                const value = e.target.value || null;
                                setData('path_prefix', value);
                                const normalizedPath =
                                    normalizePathPrefix(value);
                                if (
                                    normalizedPath === null ||
                                    normalizedPath === '/'
                                ) {
                                    setData('also_on_home', false);
                                }
                            }}
                            placeholder="/about"
                        />
                        <p className="text-xs text-muted-foreground">
                            The URL prefix of the page where this slide should
                            appear (e.g. <code>/about</code>,{' '}
                            <code>/experts</code>). Use <code>/</code> for the
                            home page. Leave blank to hide from all pages.
                            Multiple slides may share the same prefix when using
                            carousel mode.
                        </p>
                        <InputError message={errors?.path_prefix} />
                    </div>

                    {normalizedPathPrefix && normalizedPathPrefix !== '/' && (
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="also_on_home"
                                checked={Boolean(data.also_on_home)}
                                onChange={(e) =>
                                    setData('also_on_home', e.target.checked)
                                }
                                className="h-4 w-4 rounded border-input accent-beta-blue"
                            />
                            <div className="space-y-0.5">
                                <Label htmlFor="also_on_home">
                                    Also show on home page
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Include this slide in the home carousel in
                                    addition to its assigned page. Home slide
                                    order follows sort order.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Page display</Label>
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            value={data.display_type ?? 'banner'}
                            onValueChange={(value) => {
                                if (value) setData('display_type', value);
                            }}
                            className="justify-start"
                        >
                            <ToggleGroupItem value="banner" className="px-4">
                                Banner
                            </ToggleGroupItem>
                            <ToggleGroupItem value="carousel" className="px-4">
                                Carousel
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <p className="text-xs text-muted-foreground">
                            Applies to every slide sharing this page URL prefix.
                            Saving updates display for all of them.{' '}
                            {(data.display_type ?? 'banner') === 'carousel'
                                ? 'Carousel mode shows all active slides for this page, ordered by sort order.'
                                : 'Banner mode shows one slide: the first active slide for this page by sort order.'}
                        </p>
                        <InputError message={errors?.display_type} />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={Boolean(data.is_active)}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-input accent-beta-blue"
                        />
                        <Label htmlFor="is_active">
                            Active (visible on site)
                        </Label>
                    </div>
                </CardContent>
            </Card>

            {/* Display options */}
            <Card>
                <CardHeader>
                    <CardTitle>Display options</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="display_mode">Display mode</Label>
                        <select
                            id="display_mode"
                            className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={data.display_mode ?? 'normal'}
                            onChange={(e) =>
                                setData('display_mode', e.target.value)
                            }
                        >
                            <option value="normal">
                                Normal (image + text overlay)
                            </option>
                            <option value="banner_image">
                                Banner image (image only)
                            </option>
                        </select>
                        <InputError message={errors?.display_mode} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {isNormal && (
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="image_contain"
                                    checked={Boolean(data.image_contain)}
                                    onChange={(e) =>
                                        setData(
                                            'image_contain',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-input accent-beta-blue"
                                />
                                <Label htmlFor="image_contain">
                                    Image contain (don't crop)
                                </Label>
                            </div>
                        )}

                        {isBanner && (
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="banner_image_contain"
                                    checked={Boolean(data.banner_image_contain)}
                                    onChange={(e) =>
                                        setData(
                                            'banner_image_contain',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-input accent-beta-blue"
                                />
                                <Label htmlFor="banner_image_contain">
                                    Contain banner image
                                </Label>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="image_position">
                                Image position
                            </Label>
                            <select
                                id="image_position"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={data.image_position ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'image_position',
                                        e.target.value || null,
                                    )
                                }
                            >
                                <option value="">Center (default)</option>
                                <option value="right">Right</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_bg">Image background</Label>
                            <select
                                id="image_bg"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={data.image_bg ?? ''}
                                onChange={(e) =>
                                    setData('image_bg', e.target.value || null)
                                }
                            >
                                <option value="">Dark (default)</option>
                                <option value="white">White</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Media upload */}
            <Card>
                <CardHeader>
                    <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <Label>Media type</Label>
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            value={data.media_type ?? 'image'}
                            onValueChange={handleMediaTypeChange}
                            className="justify-start"
                        >
                            <ToggleGroupItem value="image" className="px-4">
                                Image
                            </ToggleGroupItem>
                            <ToggleGroupItem value="video" className="px-4">
                                Video
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <InputError message={errors?.media_type} />
                    </div>

                    {!isVideoMedia ? (
                        <>
                            {imagePreview && (
                                <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-muted">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-48 w-full object-contain"
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="image">Upload image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Max 8 MB. Accepted: JPEG, PNG, WebP, GIF.
                                </p>
                                <InputError message={errors?.image} />
                            </div>
                            {data.image_url && !data.image && (
                                <p className="text-xs text-muted-foreground">
                                    Current:{' '}
                                    <a
                                        href={data.image_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline"
                                    >
                                        {data.image_url}
                                    </a>
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <style>{`
                                @keyframes hero-video-upload-shimmer {
                                    0% { transform: translateX(-100%); }
                                    100% { transform: translateX(100%); }
                                }
                            `}</style>

                            {videoUploadState?.status === 'uploading' && (
                                <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-4">
                                    <button
                                        type="button"
                                        onClick={handleCancelVideoUpload}
                                        className="absolute end-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        aria-label="Cancel upload"
                                    >
                                        <X className="size-4" />
                                    </button>
                                    <p
                                        className="pe-8 text-sm font-medium text-foreground truncate"
                                        title={videoUploadState.fileName}
                                    >
                                        {videoUploadState.fileName}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {formatFileSize(videoUploadState.fileSize)}
                                    </p>
                                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="relative h-full overflow-hidden rounded-full bg-beta-blue transition-all duration-200"
                                            style={{
                                                width: `${videoUploadState.percent}%`,
                                            }}
                                        >
                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    background:
                                                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                                                    animation:
                                                        'hero-video-upload-shimmer 1.2s ease-in-out infinite',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                        <span>
                                            {videoUploadState.percent}% uploaded
                                        </span>
                                        <span>
                                            {videoUploadState.estimatedSeconds ==
                                            null
                                                ? 'Calculating…'
                                                : `~ ${videoUploadState.estimatedSeconds}s remaining`}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {videoUploadState?.status === 'complete' && (
                                <div className="w-full max-w-sm space-y-3">
                                    <div className="overflow-hidden rounded-xl border border-border bg-muted">
                                        <video
                                            src={videoUploadState.previewUrl}
                                            controls
                                            className="w-full rounded"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {videoUploadState.fileName}
                                        </span>
                                        {videoUploadState.fileSize != null && (
                                            <>
                                                {' '}
                                                ·{' '}
                                                {formatFileSize(
                                                    videoUploadState.fileSize,
                                                )}
                                            </>
                                        )}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleChangeVideo}
                                    >
                                        Change video
                                    </Button>
                                </div>
                            )}

                            {videoUploadState?.status === 'error' && (
                                <div className="w-full max-w-sm space-y-3 rounded-xl border border-destructive/50 bg-destructive/5 p-4">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <p className="text-sm text-destructive">
                                                {videoUploadState.message ||
                                                    'Upload failed. Please try again.'}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {videoUploadState.fileName} ·{' '}
                                                {formatFileSize(
                                                    videoUploadState.fileSize,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRetryVideoUpload}
                                        >
                                            Retry
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRemoveVideoError}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {videoUploadState === null && (
                                <div className="space-y-2">
                                    <Label htmlFor="video">Upload video</Label>
                                    <input
                                        ref={videoInputRef}
                                        id="video"
                                        type="file"
                                        accept=".mp4,.webm,video/mp4,video/webm"
                                        onChange={handleVideoChange}
                                        className={cn(
                                            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium',
                                            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Accepted: MP4, WebM. Recommended: under
                                        10MB, 5–15 seconds, no audio.
                                    </p>
                                </div>
                            )}

                            <InputError message={errors?.video_path} />

                            <input
                                ref={posterInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePosterChange}
                            />

                            {showCoverModeChoice && (
                                <div className="space-y-2">
                                    <Label>Cover image</Label>
                                    <ToggleGroup
                                        type="single"
                                        variant="outline"
                                        value={coverMode ?? 'auto'}
                                        onValueChange={handleCoverModeChange}
                                        className="justify-start"
                                    >
                                        <ToggleGroupItem
                                            value="auto"
                                            className="px-4"
                                        >
                                            Auto from video
                                        </ToggleGroupItem>
                                        <ToggleGroupItem
                                            value="custom"
                                            className="px-4"
                                        >
                                            Custom upload
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                    <p className="text-xs text-muted-foreground">
                                        {coverMode === 'auto'
                                            ? 'A frame is captured from the video for the thumbnail and loading poster.'
                                            : 'Upload your own image for the thumbnail and loading poster.'}
                                    </p>
                                </div>
                            )}

                            {useAutoCover && (
                                <>
                                    {imagePreview ? (
                                        <div className="w-full max-w-sm space-y-2">
                                            <Label>Auto-generated cover</Label>
                                            <div className="overflow-hidden rounded-xl border border-border bg-muted">
                                                <img
                                                    src={imagePreview}
                                                    alt="Auto-generated cover"
                                                    className="h-32 w-full object-cover"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {mode === 'create'
                                                    ? 'This frame was captured from your video. Upload a custom image to replace it.'
                                                    : 'This frame was captured from your video.'}
                                            </p>
                                            {mode === 'edit' && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={
                                                        regenerateAutoCover
                                                    }
                                                >
                                                    Regenerate from video
                                                </Button>
                                            )}
                                            {mode === 'create' && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        posterInputRef.current?.click()
                                                    }
                                                >
                                                    Upload custom cover
                                                </Button>
                                            )}
                                            <InputError
                                                message={errors?.image}
                                            />
                                        </div>
                                    ) : (
                                        mode === 'edit' && (
                                            <div className="space-y-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={
                                                        regenerateAutoCover
                                                    }
                                                >
                                                    Generate from video
                                                </Button>
                                                <p className="text-xs text-muted-foreground">
                                                    Capture a frame from the
                                                    current video for the cover
                                                    image.
                                                </p>
                                            </div>
                                        )
                                    )}
                                    {mode === 'create' && !imagePreview && (
                                        <p className="text-xs text-muted-foreground">
                                            A cover frame is captured
                                            automatically when you upload a
                                            video.
                                        </p>
                                    )}
                                </>
                            )}

                            {mode === 'edit' && coverMode === 'custom' && (
                                <>
                                    {imagePreview && (
                                        <div className="w-full max-w-sm space-y-2">
                                            <Label>Cover image</Label>
                                            <div className="overflow-hidden rounded-xl border border-border bg-muted">
                                                <img
                                                    src={imagePreview}
                                                    alt="Cover image"
                                                    className="h-32 w-full object-cover"
                                                />
                                            </div>
                                            <InputError
                                                message={errors?.image}
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                posterInputRef.current?.click()
                                            }
                                        >
                                            {imagePreview
                                                ? 'Replace cover image'
                                                : 'Upload cover image'}
                                        </Button>
                                        {!imagePreview && (
                                            <p className="text-xs text-muted-foreground">
                                                Upload a custom image for the
                                                thumbnail and loading poster.
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Text content — shown for normal slides */}
            {isNormal && (
                <Card>
                    <CardHeader>
                        <CardTitle>Text content</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <TriLangInputs
                            idPrefix="badge"
                            label="Badge"
                            value={data.badge}
                            onChange={(v) => setData('badge', v)}
                        />
                        <TriLangInputs
                            idPrefix="kicker"
                            label="Kicker (small eyebrow text)"
                            value={data.kicker}
                            onChange={(v) => setData('kicker', v)}
                        />
                        <TriLangInputs
                            idPrefix="title_before"
                            label="Title — main part"
                            value={data.title_before}
                            onChange={(v) => setData('title_before', v)}
                            required
                            error={errors?.['title_before.en']}
                        />
                        <TriLangInputs
                            idPrefix="title_accent"
                            label="Title — accent (highlighted in blue)"
                            value={data.title_accent}
                            onChange={(v) => setData('title_accent', v)}
                        />
                        <TriLangTextareas
                            idPrefix="description"
                            label="Description"
                            value={data.description}
                            onChange={(v) => setData('description', v)}
                        />
                        <TriLangInputs
                            idPrefix="card_line"
                            label="Card line (small sub-text below description)"
                            value={data.card_line}
                            onChange={(v) => setData('card_line', v)}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Image alt text */}
            <Card>
                <CardHeader>
                    <CardTitle>Image alt text</CardTitle>
                </CardHeader>
                <CardContent>
                    <TriLangInputs
                        idPrefix="image_alt"
                        label="Image alt text (for screen readers)"
                        value={data.image_alt}
                        onChange={(v) => setData('image_alt', v)}
                    />
                </CardContent>
            </Card>

            {/* CTAs */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Call-to-action buttons</CardTitle>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-border text-tblack hover:border-beta-blue/40 hover:bg-alpha-blue/30"
                        onClick={addCta}
                    >
                        <Plus className="size-4" />
                        Add CTA
                    </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    {(data.ctas ?? []).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No CTAs yet. Click "Add CTA" to add one.
                        </p>
                    )}
                    {(data.ctas ?? []).map((cta, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-4 rounded-xl border border-border p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <GripVertical className="size-4 text-muted-foreground" />
                                    CTA {i + 1}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCta(i)}
                                    className="text-muted-foreground transition-colors hover:text-destructive"
                                    aria-label={`Remove CTA ${i + 1}`}
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <TriLangInputs
                                idPrefix={`cta-${i}-label`}
                                label="Label"
                                value={cta.label}
                                onChange={(v) => updateCta(i, { label: v })}
                                requiredAll
                                errors={{
                                    en: errors?.[`ctas.${i}.label.en`],
                                    fr: errors?.[`ctas.${i}.label.fr`],
                                    ar: errors?.[`ctas.${i}.label.ar`],
                                }}
                            />

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor={`cta-${i}-url`}>URL</Label>
                                    <Input
                                        id={`cta-${i}-url`}
                                        value={cta.url ?? ''}
                                        onChange={(e) =>
                                            updateCta(i, {
                                                url: e.target.value,
                                            })
                                        }
                                        placeholder="/experts"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`cta-${i}-style`}>
                                        Style
                                    </Label>
                                    <select
                                        id={`cta-${i}-style`}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        value={cta.style ?? 'primary'}
                                        onChange={(e) =>
                                            updateCta(i, {
                                                style: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="primary">
                                            Primary (blue)
                                        </option>
                                        <option value="secondary">
                                            Secondary (outline)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id={`cta-${i}-active`}
                                    checked={Boolean(cta.is_active)}
                                    onChange={(e) =>
                                        updateCta(i, {
                                            is_active: e.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 rounded border-input accent-beta-blue"
                                />
                                <Label htmlFor={`cta-${i}-active`}>
                                    Active
                                </Label>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={saveDisabled}
                    className="bg-beta-blue text-twhite hover:bg-beta-blue/90"
                >
                    {saveButtonLabel}
                </Button>
            </div>
        </form>
    );
}
