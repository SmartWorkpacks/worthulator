$file = ".\components\calculators\RentVsBuyCalculator.tsx"
$text = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Each corrupted sequence -> correct Unicode replacement
$fixes = @(
  # en-dash (â€" = U+2013 double-encoded)
  @{ From = [System.Text.Encoding]::UTF8.GetString([byte[]](0xC3,0xA2,0xC2,0x80,0xC2,0x93)); To = [char]0x2013 },
  # right arrow â†' (U+2192)
  @{ From = [System.Text.Encoding]::UTF8.GetString([byte[]](0xC3,0xA2,0xC2,0x86,0xC2,0x92)); To = [char]0x2192 },
  # up triangle â–² (U+25B2)
  @{ From = [System.Text.Encoding]::UTF8.GetString([byte[]](0xC3,0xA2,0xC2,0x96,0xC2,0xB2)); To = [char]0x25B2 },
  # down triangle â–¼ (U+25BC)
  @{ From = [System.Text.Encoding]::UTF8.GetString([byte[]](0xC3,0xA2,0xC2,0x96,0xC2,0xBC)); To = [char]0x25BC },
  # warning âš  (U+26A0) + variation selector (U+FE0F)
  @{ From = [System.Text.Encoding]::UTF8.GetString([byte[]](0xC3,0xA2,0xC2,0x9A,0xC2,0xA0,0xC3,0xAF,0xC2,0xB8)); To = ([char]0x26A0 + [char]0xFE0F) }
)

foreach ($fix in $fixes) {
  if ($text.Contains($fix.From)) {
    Write-Host "Fixing: $($fix.From.Length) chars -> $($fix.To)"
    $text = $text.Replace($fix.From, $fix.To)
  }
}

[System.IO.File]::WriteAllText($file, $text, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done"
