<?php

use App\Support\SafeHtml;

test('safe html strips script tags', function () {
    $input = '<p>Hello</p><script>alert(1)</script>';
    expect(SafeHtml::sanitize($input))->toBe('<p>Hello</p>');
});

test('safe html removes javascript hrefs', function () {
    $input = '<a href="javascript:alert(1)">click</a>';
    expect(SafeHtml::sanitize($input))->not->toContain('javascript:');
});
