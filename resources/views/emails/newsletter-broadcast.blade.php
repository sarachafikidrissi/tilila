<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $emailSubject }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 640px; margin: 0 auto; padding: 24px;">
    <div style="margin-bottom: 24px;">
        <strong style="color: #0097aa;">TILILA</strong>
    </div>

    <div>{!! $bodyHtml !!}</div>

    <p style="margin-top: 32px; font-size: 12px; color: #64748b;">
        You received this email because you subscribed to the TILILA newsletter.
    </p>
</body>
</html>
