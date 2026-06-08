<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ProgramRegulationController extends Controller
{
    public function tilila(): InertiaResponse
    {
        return Inertia::render('user/program/reglement', [
            'program' => 'tilila',
            'downloadUrl' => route('program.reglement.tilila.download'),
            'backUrl' => '/tilila',
        ]);
    }

    public function tililab(): InertiaResponse
    {
        return Inertia::render('user/program/reglement', [
            'program' => 'tililab',
            'downloadUrl' => route('program.reglement.tililab.download'),
            'backUrl' => '/tililab',
        ]);
    }

    public function downloadTilila(): BinaryFileResponse|Response
    {
        return $this->downloadDocument('reglement-tilila-awards-2026', 'Reglement-Tilila-Awards-2026');
    }

    public function downloadTililab(): BinaryFileResponse|Response
    {
        return $this->downloadDocument('reglement-tililab-2026', 'Reglement-Tililab-2026');
    }

    private function downloadDocument(string $basename, string $downloadName): BinaryFileResponse|Response
    {
        $pdf = public_path("documents/{$basename}.pdf");
        $docx = public_path("documents/{$basename}.docx");

        if (File::exists($pdf)) {
            return response()->download($pdf, "{$downloadName}.pdf");
        }

        if (File::exists($docx)) {
            return response()->download($docx, "{$downloadName}.docx");
        }

        abort(404);
    }
}
