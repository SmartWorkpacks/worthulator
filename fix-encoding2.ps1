$file = ".\components\calculators\RentVsBuyCalculator.tsx"
$text = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

function Chars([int[]]$codes) { -join ($codes | ForEach-Object { [char]$_ }) }

$fixes = @(
  # up-triangle U+25B2 (stored as â–²)
  @{ From = Chars @(0x00E2, 0x2013, 0x00B2);                                          To = [string][char]0x25B2 },
  # down-triangle U+25BC (stored as â–¼)
  @{ From = Chars @(0x00E2, 0x2013, 0x00BC);                                          To = [string][char]0x25BC },
  # right-arrow U+2192 (stored as â†')
  @{ From = Chars @(0x00E2, 0x2020, 0x2018);                                          To = [string][char]0x2192 },
  # em-dash U+2014 (stored as â€")
  @{ From = Chars @(0x00E2, 0x20AC, 0x201D);                                          To = [string][char]0x2014 },
  # en-dash U+2013 (stored as â€")
  @{ From = Chars @(0x00E2, 0x20AC, 0x201C);                                          To = [string][char]0x2013 },
  # warning sign + variation selector U+26A0 U+FE0F
  @{ From = Chars @(0x00E2, 0x0161, 0x00A0, 0x00EF, 0x00B8, 0x008F);                 To = ([string][char]0x26A0 + [string][char]0xFE0F) }
)

foreach ($fix in $fixes) {
  $count = ([regex]::Matches($text, [regex]::Escape($fix.From))).Count
  if ($count -gt 0) {
    Write-Host "Fixed $count x -> [$($fix.To)]"
    $text = $text.Replace($fix.From, $fix.To)
  } else {
    Write-Host "No match for -> [$($fix.To)]"
  }
}

# Simplify button text (now that em-dash is fixed)
$btnOld = "Calculate " + [string][char]0x2014 + " see my financial future"
if ($text.Contains($btnOld)) {
  $text = $text.Replace($btnOld, "Calculate")
  Write-Host "Fixed button text"
}

[System.IO.File]::WriteAllText($file, $text, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done"
