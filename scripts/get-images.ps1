# PowerShell script to download real product images
# Run: powershell -ExecutionPolicy Bypass -File scripts\get-images.ps1
param([string]$OutputDir = "public\products")

if (!(Test-Path $OutputDir)) { 
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null 
}

$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }

function Get-WalmartImage {
    param([string]$Query)
    $encoded = [Uri]::EscapeDataString($Query)
    $url = "https://www.walmart.com/search?q=$encoded"
    try {
        $resp = Invoke-WebRequest -Uri $url -Headers $headers -TimeoutSec 25 -UseBasicParsing -ErrorAction Stop
        $html = $resp.Content
        # Extract og:image
        if ($html -match 'property="og:image" content="([^"]+)"') {
            $imgUrl = $Matches[1] -replace '&amp;','&'
            # Upscale to 600x600
            $imgUrl = $imgUrl -replace 'odnHeight=\d+','odnHeight=600' -replace 'odnWidth=\d+','odnWidth=600'
            return $imgUrl
        }
        if ($html -match '"og:image","content":"([^"\\]+)"') {
            return $Matches[1]
        }
    } catch {
        Write-Host "    Request failed: $($_.Exception.Message)" -ForegroundColor DarkRed
    }
    return $null
}

function Save-Image {
    param([string]$Url, [string]$Dest)
    try {
        Invoke-WebRequest -Uri $Url -Headers $headers -OutFile $Dest -TimeoutSec 20 -UseBasicParsing -ErrorAction Stop
        $size = (Get-Item $Dest -ErrorAction SilentlyContinue).Length
        if ($size -lt 2000) {
            Remove-Item $Dest -Force -ErrorAction SilentlyContinue
            return $false
        }
        return $true
    } catch {
        Remove-Item $Dest -Force -ErrorAction SilentlyContinue
        return $false
    }
}

# slug => Walmart search query
$products = [ordered]@{
    "dove-body-wash" = "Dove Deep Moisture Body Wash"
    "philosophy-bath-shower-gel" = "Philosophy Amazing Grace Bath Shower Gel"
    "dove-shea-butter-vanilla-body-wash" = "Dove Shea Butter Warm Vanilla Body Wash"
    "dove-purely-pampering-cream-body-wash" = "Dove Purely Pampering Cream Body Wash"
    "method-body-wash-pure-peace" = "Method Body Wash Pure Peace"
    "dove-beauty-bar-soap" = "Dove Beauty Bar Original"
    "olay-super-serum-body-wash" = "Olay Super Serum Body Wash Extra Dry Skin"
    "glycolic-acid-exfoliating-toner" = "Glycolic Acid 7 percent Exfoliating Toner"
    "dove-pomegranate-shea-butter-scrub" = "Dove Pomegranate Shea Butter Body Scrub"
    "tree-hut-body-scrub" = "Tree Hut Shea Sugar Body Scrub"
    "premium-exfoliating-mitt" = "Exfoliating Mitt Shower"
    "korean-exfoliating-glove" = "Korean Italy Exfoliating Gloves Mitt"
    "silicone-bath-shampoo-brush" = "Silicone Body Brush Shampoo Scrubber"
    "dry-body-brush-natural-bristles" = "Dry Body Brush Natural Bristles"
    "shower-brush-long-handle" = "Shower Body Brush Long Handle Back"
    "eos-shea-butter-shave-cream" = "eos Shea Butter Shave Cream"
    "gillette-venus-comfortglide-razor" = "Gillette Venus ComfortGlide Womens Razor"
    "eos-moisturizer" = "eos Shea Moisturizer Body Lotion"
    "nivea-cocoa-butter-body-cream" = "NIVEA Cocoa Butter Body Cream"
    "victorias-secret-body-lotion" = "Victorias Secret Body Lotion"
    "johnsons-baby-lotion" = "Johnsons Baby Lotion"
    "johnsons-baby-oil" = "Johnsons Baby Oil"
    "sol-de-janeiro-cheirosa-59" = "Sol de Janeiro Cheirosa 59 Hair Body Mist"
    "sol-de-janeiro-cheirosa-68" = "Sol de Janeiro Cheirosa 68 Body Mist"
    "sol-de-janeiro-cheirosa-62" = "Sol de Janeiro Cheirosa 62 Body Mist"
    "eos-cashmere-body-mist" = "eos Cashmere Vanilla Body Mist Spray"
    "ariana-grande-mod-vanilla-perfume" = "Ariana Grande MOD Vanilla Perfume"
    "billie-eilish-eau-de-parfum" = "Billie Eilish Eau de Parfum"
    "dove-advanced-care-deodorant-spray" = "Dove Advanced Care Antiperspirant Spray"
    "ice-roller-face-eye" = "Ice Roller Face Skincare Tool"
    "garnier-micellar-facial-cleanser" = "Garnier Micellar Cleansing Water"
    "neutrogena-makeup-remover-towelettes" = "Neutrogena Makeup Remover Wipes Pink Grapefruit"
    "byoma-creamy-jelly-cleanser" = "BYOMA Creamy Jelly Cleanser"
    "cerave-air-foam-face-wash" = "CeraVe Hydrating Facial Cleanser Face Wash"
    "honest-beauty-gentle-gel-cleanser" = "Honest Beauty Gentle Gel Cleanser Sensitive"
    "skin1004-water-fit-sun-serum" = "SKIN1004 Water Fit Sun Serum SPF 50"
    "relief-sun-organic-korean-sunscreen" = "Korean Sunscreen SPF 50 Lightweight"
    "the-ordinary-salicylic-acid-solution" = "The Ordinary Salicylic Acid 2 percent Solution"
    "glow-recipe-pha-bha-face-toner" = "Glow Recipe Watermelon Glow PHA BHA Toner"
    "elf-skin-holy-hydration-peeling-exfoliant" = "elf Holy Hydration Gentle Peeling Exfoliant"
    "biodance-bio-collagen-deep-mask" = "BIODANCE Bio-Collagen Real Deep Mask"
    "cosrx-snail-mucin-sheet-mask" = "COSRX Snail Mucin Sheet Mask"
    "innisfree-cherry-blossom-glow-jelly-cream" = "Innisfree Cherry Blossom Glow Jelly Cream"
    "fresh-lotus-youth-preserve-dream-cream" = "Fresh Lotus Youth Preserve Dream Cream"
    "bio-oil-skincare-body-oil-serum" = "Bio Oil Skincare Body Oil Scars"
    "the-ordinary-multi-peptide-eye-serum" = "The Ordinary Multi-Peptide Eye Serum"
    "laneige-lip-sleeping-mask" = "LANEIGE Lip Sleeping Mask"
    "summer-fridays-lip-butter-balm" = "Summer Fridays Lip Butter Balm"
    "amoado-sugar-lip-scrub" = "Sugar Lip Scrub Exfoliating"
    "vaseline-lip-therapy" = "Vaseline Lip Therapy Original"
    "ouai-leave-in-conditioner" = "OUAI Leave In Conditioner"
    "olaplex-no5-leave-in-conditioner" = "Olaplex No 5 Leave In Conditioner"
    "mielle-rosemary-mint-hair-oil" = "Mielle Organics Rosemary Mint Scalp Hair Oil Biotin"
    "olaplex-no7-bonding-hair-oil" = "Olaplex No 7 Bonding Oil"
    "ouai-hair-oil-bundle" = "OUAI Hair Oil Shine"
    "self-grip-hair-rollers" = "Self Grip Hair Rollers Set Styling"
    "cat-shape-hair-head-massager" = "Scalp Massager Comb Head"
    "scalp-scrubber-silicone-bristles" = "Scalp Scrubber Silicone Shampoo Brush"
    "vent-hairbrush-for-women" = "Vent Hairbrush Women Detangling"
    "frizz-control-blowout-hair-dryer-brush" = "Hot Air Brush Hair Dryer Styler Blowout"
    "gainwell-bamboo-hair-brush" = "Bamboo Hair Brush Natural Bristle"
    "monday-haircare-volume-shampoo-conditioner" = "MONDAY HAIRCARE Volume Shampoo"
    "conditioner-fragrance-free-hydrating-scalp" = "Fragrance Free Hydrating Conditioner"
    "garnier-honey-treasures-repairing-shampoo" = "Garnier Whole Blends Honey Treasures Repairing Shampoo"
    "garnier-fructis-pure-clean-shampoo" = "Garnier Fructis Pure Clean Shampoo"
    "garnier-fructis-sleek-shine-shampoo-conditioner" = "Garnier Fructis Sleek Shine Shampoo"
    "garnier-fructis-curl-nourish-shampoo-conditioner" = "Garnier Fructis Curl Nourish Shampoo Curly"
    "loreal-elvive-glycolic-gloss-shampoo" = "LOreal Paris Elvive Glycolic Gloss Shampoo"
}

$success = 0
$failed = 0
$skipped = 0
$total = $products.Count

Write-Host "Downloading images for $total products..." -ForegroundColor Magenta
Write-Host ""

$i = 0
foreach ($kvp in $products.GetEnumerator()) {
    $i++
    $slug = $kvp.Key
    $query = $kvp.Value

    $destJpg = Join-Path $OutputDir "$slug.jpg"

    if (Test-Path $destJpg) {
        Write-Host "[$i/$total] SKIP (exists): $slug" -ForegroundColor DarkGreen
        $skipped++
        continue
    }

    Write-Host "[$i/$total] Fetching: $slug" -ForegroundColor Cyan
    $imgUrl = Get-WalmartImage -Query $query

    if ($imgUrl) {
        Write-Host "  -> $($imgUrl.Substring(0, [Math]::Min(80,$imgUrl.Length)))..." -ForegroundColor DarkGray
        $ok = Save-Image -Url $imgUrl -Dest $destJpg
        if ($ok) {
            $size = [Math]::Round((Get-Item $destJpg).Length / 1KB, 1)
            Write-Host "  OK: ${slug}.jpg ($size KB)" -ForegroundColor Green
            $success++
        } else {
            Write-Host "  FAIL: could not save image" -ForegroundColor Red
            $failed++
        }
    } else {
        Write-Host "  FAIL: no image URL found" -ForegroundColor Red
        $failed++
    }

    Start-Sleep -Milliseconds 600
}

Write-Host ""
Write-Host "Results: $success success, $skipped skipped, $failed failed out of $total" -ForegroundColor Yellow
