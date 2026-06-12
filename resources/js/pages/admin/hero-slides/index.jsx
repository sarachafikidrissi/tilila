import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronUp,
    GripVertical,
    Pencil,
    Plus,
    Power,
    Trash2,
    Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

const KNOWN_ROUTE_KEYS = [
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

function canToggleAlsoOnHome(slide) {
    const prefix = slide.path_prefix;
    if (!prefix) return false;
    const norm = prefix.replace(/\/$/, '') || '/';
    return norm !== '/';
}

function isHomePathSlide(slide) {
    const prefix = slide.path_prefix;
    if (!prefix) return false;
    return (prefix.replace(/\/$/, '') || '/') === '/';
}

function SortableRow({
    slide,
    index,
    total,
    onMoveUp,
    onMoveDown,
    onToggle,
    onToggleAlsoOnHome,
    onDelete,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: slide.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell className="w-8 px-2">
                <button
                    type="button"
                    className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
                    aria-label="Drag to reorder"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="size-4" />
                </button>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-0.5">
                    <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onMoveUp(index)}
                        className="p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Move up"
                    >
                        <ChevronUp className="size-4" />
                    </button>
                    <button
                        type="button"
                        disabled={index === total - 1}
                        onClick={() => onMoveDown(index)}
                        className="p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Move down"
                    >
                        <ChevronDown className="size-4" />
                    </button>
                </div>
            </TableCell>
            <TableCell>
                {slide.media_type === 'video' ? (
                    <div className="relative h-10 w-14 overflow-hidden rounded-lg border border-border bg-muted">
                        {slide.image_url ? (
                            <img
                                src={slide.image_url}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-muted-foreground">
                                Video
                            </div>
                        )}
                        <span className="absolute end-0.5 bottom-0.5 inline-flex items-center justify-center rounded bg-tblack/70 p-0.5 text-white">
                            <Video className="size-3" aria-hidden />
                            <span className="sr-only">Video slide</span>
                        </span>
                    </div>
                ) : slide.image_url ? (
                    <div className="h-10 w-14 overflow-hidden rounded-lg border border-border bg-muted">
                        <img
                            src={slide.image_url}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="h-10 w-14 rounded-lg border border-border bg-muted" />
                )}
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                        {slide.slide_key}
                    </code>
                    <div className="flex flex-wrap gap-1">
                        {slide.path_prefix ? (
                            <Badge
                                variant="outline"
                                className="font-mono text-[10px]"
                            >
                                {slide.path_prefix}
                            </Badge>
                        ) : null}
                        {slide.also_on_home ? (
                            <Badge
                                variant="outline"
                                className="border-beta-blue/40 bg-beta-blue/10 text-[10px] text-beta-blue"
                            >
                                + Home
                            </Badge>
                        ) : null}
                    </div>
                </div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {slide.title_before?.fr ?? slide.title_before?.en ?? '—'}
                {slide.title_accent?.fr ? (
                    <span className="text-beta-blue">
                        {' '}
                        {slide.title_accent.fr}
                    </span>
                ) : null}
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="text-xs capitalize">
                    {slide.display_mode === 'banner_image'
                        ? 'Banner'
                        : 'Normal'}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant="outline"
                    className={cn(
                        'text-xs',
                        slide.is_active
                            ? 'border-alpha-green/40 bg-beta-green text-alpha-green'
                            : 'border-border bg-muted text-muted-foreground',
                    )}
                >
                    {slide.is_active ? 'Active' : 'Inactive'}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant="outline"
                    className={cn(
                        'text-xs capitalize',
                        slide.display_type === 'carousel'
                            ? 'border-beta-blue/40 bg-beta-blue/10 text-beta-blue'
                            : 'border-border bg-muted text-muted-foreground',
                    )}
                >
                    {slide.display_type === 'carousel' ? 'Carousel' : 'Banner'}
                </Badge>
            </TableCell>
            <TableCell>
                {isHomePathSlide(slide) ? (
                    <span className="text-xs text-muted-foreground">Home</span>
                ) : (
                    <Switch
                        checked={Boolean(slide.also_on_home)}
                        disabled={!canToggleAlsoOnHome(slide)}
                        onCheckedChange={() => onToggleAlsoOnHome(slide)}
                        title={
                            canToggleAlsoOnHome(slide)
                                ? slide.also_on_home
                                    ? 'Remove from home carousel'
                                    : 'Also show on home page'
                                : 'Set a page URL prefix (not home) to enable'
                        }
                        aria-label={
                            slide.also_on_home
                                ? 'Also on home, on'
                                : 'Also on home, off'
                        }
                    />
                )}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-border text-tblack hover:border-beta-blue/40 hover:bg-alpha-blue/30"
                    >
                        <Link href={`/admin/hero-slides/${slide.id}/edit`}>
                            <Pencil className="size-3.5" />
                            Edit
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-border text-tblack hover:border-beta-blue/40 hover:bg-alpha-blue/30"
                        onClick={() => onToggle(slide)}
                        title={slide.is_active ? 'Deactivate' : 'Activate'}
                    >
                        <Power className="size-3.5" />
                        {slide.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-alpha-danger/40 text-alpha-danger hover:bg-beta-danger"
                        onClick={() => onDelete(slide)}
                    >
                        <Trash2 className="size-3.5" />
                        Delete
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function AdminHeroSlidesIndex({ slides: initialSlides = [] }) {
    const [slides, setSlides] = useState(initialSlides);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const slidesSignature = initialSlides
        .map(
            (s) =>
                `${s.id}:${s.is_active ? 1 : 0}:${s.sort_order ?? 0}:${s.also_on_home ? 1 : 0}`,
        )
        .join('|');

    useEffect(() => {
        setSlides(initialSlides);
    }, [slidesSignature]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    function patchSlideBoolean(slide, field, url, { guard } = {}) {
        if (guard && !guard(slide)) return;

        const priorValue =
            slides.find((s) => s.id === slide.id)?.[field] ?? slide[field];

        setSlides((prev) =>
            prev.map((s) =>
                s.id === slide.id ? { ...s, [field]: !s[field] } : s,
            ),
        );

        router.patch(
            url,
            {},
            {
                preserveScroll: true,
                onError: () =>
                    setSlides((prev) =>
                        prev.map((s) =>
                            s.id === slide.id
                                ? { ...s, [field]: priorValue }
                                : s,
                        ),
                    ),
            },
        );
    }

    const handleToggle = (slide) =>
        patchSlideBoolean(
            slide,
            'is_active',
            `/admin/hero-slides/${slide.id}/toggle`,
        );

    const handleToggleAlsoOnHome = (slide) =>
        patchSlideBoolean(
            slide,
            'also_on_home',
            `/admin/hero-slides/${slide.id}/toggle-also-on-home`,
            { guard: canToggleAlsoOnHome },
        );

    const sendReorder = (reordered) => {
        router.post(
            '/admin/hero-slides/reorder',
            {
                ordered_ids: reordered.map((s) => s.id),
            },
            { preserveScroll: true },
        );
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const reordered = [...slides];
        [reordered[index - 1], reordered[index]] = [
            reordered[index],
            reordered[index - 1],
        ];
        setSlides(reordered);
        sendReorder(reordered);
    };

    const handleMoveDown = (index) => {
        if (index === slides.length - 1) return;
        const reordered = [...slides];
        [reordered[index], reordered[index + 1]] = [
            reordered[index + 1],
            reordered[index],
        ];
        setSlides(reordered);
        sendReorder(reordered);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        const id = deleteTarget.id;
        router.delete(`/admin/hero-slides/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setSlides((prev) => prev.filter((s) => s.id !== id));
            },
            onFinish: () => setDeleteTarget(null),
        });
    };

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = slides.findIndex((s) => s.id === active.id);
        const newIndex = slides.findIndex((s) => s.id === over.id);
        const previous = slides;
        const reordered = arrayMove(slides, oldIndex, newIndex);
        setSlides(reordered);
        router.post(
            '/admin/hero-slides/reorder',
            { ordered_ids: reordered.map((s) => s.id) },
            { preserveScroll: true, onError: () => setSlides(previous) },
        );
    };

    return (
        <>
            <Head title="Hero Carousel" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Contenu
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Hero Carousel
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Manage the hero carousel slides shown across the
                            site. Drag or use the arrows to reorder.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="gap-2 bg-beta-blue text-twhite hover:bg-beta-blue/90"
                    >
                        <Link
                            href="/admin/hero-slides/create"
                            className="gap-2"
                        >
                            <Plus className="size-4" />
                            New slide
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-border">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={slides.map((s) => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-8 px-2">
                                            <span className="sr-only">
                                                drag to reorder
                                            </span>
                                        </TableHead>
                                        <TableHead className="w-16">
                                            Order
                                        </TableHead>
                                        <TableHead className="w-20">
                                            Image
                                        </TableHead>
                                        <TableHead>Slide key</TableHead>
                                        <TableHead>Title (FR)</TableHead>
                                        <TableHead>Mode</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Display</TableHead>
                                        <TableHead>On home</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {slides.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={10}
                                                className="py-10 text-center text-sm text-muted-foreground"
                                            >
                                                No slides yet. Create your first
                                                slide.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {slides.map((slide, index) => (
                                        <SortableRow
                                            key={slide.id}
                                            slide={slide}
                                            index={index}
                                            total={slides.length}
                                            onMoveUp={handleMoveUp}
                                            onMoveDown={handleMoveDown}
                                            onToggle={handleToggle}
                                            onToggleAlsoOnHome={
                                                handleToggleAlsoOnHome
                                            }
                                            onDelete={setDeleteTarget}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            <AlertDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete slide "{deleteTarget?.slide_key}"?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                            {KNOWN_ROUTE_KEYS.includes(
                                deleteTarget?.slide_key ?? '',
                            ) && (
                                <span className="mt-2 block font-semibold text-amber-600">
                                    Warning: "{deleteTarget?.slide_key}" is a
                                    built-in slide key. Deleting it will leave
                                    the hero blank on that route.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-alpha-danger text-twhite hover:bg-alpha-danger/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

AdminHeroSlidesIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
