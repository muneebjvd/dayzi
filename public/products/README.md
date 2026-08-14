# Product Images

Place real product images in this folder. The filename must match the product slug exactly.

## Accepted formats: `.jpg`, `.jpeg`, `.png`, `.webp`

## Image naming convention:
The image filename must exactly match the product slug from `products.ts`.

## How to set up images

1. Download a product image (from Amazon, brand website, Google Images, etc.)
2. Save it here as: `public/products/<slug>.jpg` (or `.png`, `.webp`)
3. Open `src/data/products.ts` and find the product
4. Change `image: null` to `image: "/products/<slug>.jpg"`
5. The site will automatically show the real image on cards and detail pages

## Full list of product slugs (68 products):

### Body Care
- dove-body-wash
- philosophy-bath-shower-gel
- dove-shea-butter-vanilla-body-wash
- dove-purely-pampering-cream-body-wash
- method-body-wash-pure-peace
- dove-beauty-bar-soap
- olay-super-serum-body-wash
- glycolic-acid-exfoliating-toner
- dove-pomegranate-shea-butter-scrub
- tree-hut-body-scrub
- premium-exfoliating-mitt
- korean-exfoliating-glove
- silicone-bath-shampoo-brush
- dry-body-brush-natural-bristles
- shower-brush-long-handle
- eos-shea-butter-shave-cream
- gillette-venus-comfortglide-razor
- eos-moisturizer
- nivea-cocoa-butter-body-cream
- victorias-secret-body-lotion
- johnsons-baby-lotion
- johnsons-baby-oil
- sol-de-janeiro-cheirosa-59
- sol-de-janeiro-cheirosa-68
- sol-de-janeiro-cheirosa-62
- eos-cashmere-body-mist
- ariana-grande-mod-vanilla-perfume
- billie-eilish-eau-de-parfum
- dove-advanced-care-deodorant-spray

### Skincare
- ice-roller-face-eye
- garnier-micellar-facial-cleanser
- neutrogena-makeup-remover-towelettes
- byoma-creamy-jelly-cleanser
- cerave-air-foam-face-wash
- honest-beauty-gentle-gel-cleanser
- skin1004-water-fit-sun-serum
- relief-sun-organic-korean-sunscreen
- the-ordinary-salicylic-acid-solution
- glow-recipe-pha-bha-face-toner
- elf-skin-holy-hydration-peeling-exfoliant
- biodance-bio-collagen-deep-mask
- cosrx-snail-mucin-sheet-mask
- innisfree-cherry-blossom-glow-jelly-cream
- fresh-lotus-youth-preserve-dream-cream
- bio-oil-skincare-body-oil-serum
- the-ordinary-multi-peptide-eye-serum
- laneige-lip-sleeping-mask
- summer-fridays-lip-butter-balm
- amoado-sugar-lip-scrub
- vaseline-lip-therapy

### Hair Care
- ouai-leave-in-conditioner
- olaplex-no5-leave-in-conditioner
- mielle-rosemary-mint-hair-oil
- olaplex-no7-bonding-hair-oil
- ouai-hair-oil-bundle
- self-grip-hair-rollers
- cat-shape-hair-head-massager
- scalp-scrubber-silicone-bristles
- vent-hairbrush-for-women
- frizz-control-blowout-hair-dryer-brush
- gainwell-bamboo-hair-brush
- monday-haircare-volume-shampoo-conditioner
- conditioner-fragrance-free-hydrating-scalp
- garnier-honey-treasures-repairing-shampoo
- garnier-fructis-pure-clean-shampoo
- garnier-fructis-sleek-shine-shampoo-conditioner
- garnier-fructis-curl-nourish-shampoo-conditioner
- loreal-elvive-glycolic-gloss-shampoo

## Tips for finding images
- **Amazon**: Go to the product page → right-click the main image → "Open in new tab" → save
- **Google Images**: Search "[product name] product photo" → right-click → Save
- **Brand websites**: Usually have high-quality packshots in press/media sections
- **Recommended size**: 600×600px minimum, square or portrait

## After adding images, update products.ts

Example change in `src/data/products.ts`:
```ts
// Before:
image: null,

// After (once you saved dove-body-wash.jpg in public/products/):
image: "/products/dove-body-wash.jpg",
```
