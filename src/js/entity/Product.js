import ProductPlacement from "@/js/entity/Product/Product.Placement.js";
import ProductVariant from "@/js/entity/Product/Product.Variant.js";
import ProductPersonalization from "@/js/entity/Product/Product.Personalization.js";
import productVariant from "@/js/entity/Product/Product.Variant.js";
import sage from "@/js/api/sage.js";
import entity from "@/js/entity.js";
import productPersonalization from "@/js/entity/Product/Product.Personalization.js";

let default_categories = [{"name":"Apparel","handle":"app","children":[{"name":"T-Shirts","handle":"app-ts","children":[{"name":"100% Cotton","handle":"app-ts-100cttn"},{"name":"6-6.1 100% Cotton","handle":"app-ts-6oz"},{"name":"5-5.6 100% Cotton","handle":"app-ts-5oz"},{"name":"Tri-Blend","handle":"app-ts-tri"},{"name":"50/50 Blend","handle":"app-ts-5050"},{"name":"Performance","handle":"app-ts-perf"},{"name":"Tanks","handle":"app-ts-tank"},{"name":"Ladies/Women","handle":"app-ts-ladies"},{"name":"Youth","handle":"app-ts-yth"},{"name":"Ring Spun","handle":"app-ts-ringspun"},{"name":"Long Sleeve","handle":"app-ts-ls"},{"name":"Specialty","handle":"app-ts-special"},{"name":"Fashion","handle":"app-ts-fshn"},{"name":"Workwear","handle":"app-ts-wrk"},{"name":"Tall","handle":"app-ts-tall"}]},{"name":"Polos/Knits","handle":"app-pk","children":[{"name":"Performance","handle":"app-pk-perf"},{"name":"Easy Care","handle":"app-pk-easycare"},{"name":"Silk Touch","handle":"app-pk-silktouch"},{"name":"Cotton","handle":"app-pk-cttn"},{"name":"Polos/Knits - Workwear","handle":"app-pk-wrk"},{"name":"Sweaters","handle":"app-pk-swtrs"},{"name":"Mock/Turtlenecks","handle":"app-pk-trtlnck"},{"name":"Ladies/Women","handle":"app-pk-ladies"},{"name":"Youth","handle":"app-pk-yth"},{"name":"Tall","handle":"app-pk-tall"}]},{"name":"Sweatshirts/Fleece","handle":"app-sf","children":[{"name":"Crewnecks","handle":"app-sf-crew"},{"name":"Hoodie","handle":"app-sf-hoodie"},{"name":"Performance","handle":"app-sf-perf"},{"name":"Sweatpants","handle":"app-sf-swtpnts"},{"name":"1/2 & 1/4 Zip","handle":"app-sf-1/2-1/4"},{"name":"Full Zip","handle":"app-sf-fullzip"},{"name":"Ladies/Women","handle":"app-sf-ladies"},{"name":"Youth","handle":"app-sf-yth"},{"name":"Fleece","handle":"app-sf-fleece"},{"name":"Heavyweight","handle":"app-sf-hvywght"},{"name":"Tall","handle":"app-sf-tall"}]},{"name":"Activewear","handle":"app-aw","children":[{"name":"Performance","handle":"app-aw-perf"},{"name":"Jerseys","handle":"app-aw-jersey"},{"name":"Tanks","handle":"app-aw-tank"},{"name":"Athletic/Warm-Ups","handle":"app-aw-athltc"},{"name":"Ladies/Women","handle":"app-aw-ladies"},{"name":"Baseball","handle":"app-aw-baseball"},{"name":"Basketball","handle":"app-aw-bsktball"},{"name":"Youth","handle":"app-aw-yth"},{"name":"Pants & Shorts","handle":"app-aw-pants"},{"name":"Tall","handle":"app-aw-tall"}]},{"name":"Outerwear","handle":"app-ow","children":[{"name":"Soft Shells","handle":"app-ow-softshell"},{"name":"Polyester Fleece","handle":"app-ow-polyfleece"},{"name":"Rainwear","handle":"app-ow-rainwear"},{"name":"3-in-1","handle":"app-ow-3n1"},{"name":"Athletic/Warm-Ups","handle":"app-ow-athltc"},{"name":"Vests","handle":"app-ow-vest"},{"name":"Corporate Jackets","handle":"app-ow-corp"},{"name":"Work Jackets","handle":"app-ow-wrk"},{"name":"Golf Outerwear","handle":"app-ow-golf"},{"name":"Insulated Jackets","handle":"app-ow-insulated"},{"name":"Camouflage","handle":"app-ow-camo"},{"name":"Ladies/Women","handle":"app-ow-ladies"},{"name":"Youth","handle":"app-ow-yth"},{"name":"Tall","handle":"app-ow-tall"}]},{"name":"Woven/Dress Shirts","handle":"app-wds","children":[{"name":"Easy Care","handle":"app-wds-easycare"},{"name":"Oxfords","handle":"app-wds-oxford"},{"name":"Workwear","handle":"app-wds-wrk"},{"name":"Denim","handle":"app-wds-denim"},{"name":"Cotton","handle":"app-wds-cotton"},{"name":"Fishing","handle":"app-wds-fishing"},{"name":"Camp Shirts","handle":"app-wds-camp"},{"name":"Ladies/Women","handle":"app-wds-ladies"},{"name":"Cotton/Poly Blend","handle":"app-wds-cottnpoly"},{"name":"100% Cotton","handle":"app-wds-100cttn"},{"name":"Premium Wovens","handle":"app-wds-premium"},{"name":"Tall","handle":"app-wds-tall"}]},{"name":"Caps","handle":"app-cap","children":[{"name":"Stretch-to-Fit","handle":"app-cap-stretch"},{"name":"Performance/Team","handle":"app-cap-perf"},{"name":"Flexfit","handle":"app-cap-flexfit"},{"name":"Mesh Back","handle":"app-cap-mesh"},{"name":"Structured","handle":"app-cap-structured"},{"name":"Unstructured","handle":"app-cap-unstructured"},{"name":"Fashion","handle":"app-cas-fash"},{"name":"Pigment/Garment Dyed","handle":"app-cap-pigdyed"},{"name":"Camoflauge","handle":"app-cap-camo"},{"name":"Safety","handle":"app-cap-safety"},{"name":"Full Brim","handle":"app-cap-fllbrm"},{"name":"Visors","handle":"app-cap-visors"},{"name":"Fleece/Beanies","handle":"app-cap-beanies"},{"name":"Twill","handle":"app-cap-twill"},{"name":"Youth","handle":"app-cap-youth"}]},{"name":"Bottoms","handle":"app-btms","children":[{"name":"Sweatpants","handle":"app-btms-swtpnts"},{"name":"Joggers","handle":"app-btms-jog"},{"name":"Shorts","handle":"app-btms-shorts"},{"name":"Workwear","handle":"app-btms-wrk"},{"name":"Scrub Pants","handle":"app-btms-scrub"},{"name":"Ladies/Women","handle":"app-btms-ladies"},{"name":"Youth","handle":"app-btms-yth"}]},{"name":"Workwear","handle":"app-ww","children":[{"name":"Industrial Work Shirts","handle":"app-ww-indstrl-shirt"},{"name":"Stain/Soil Resistant","handle":"app-ww-stainsoil"},{"name":"Industrial Work Pants/Shorts","handle":"app-ww-indstrl-pant"},{"name":"Work Jackets","handle":"app-ww-jckt"},{"name":"Safety","handle":"app-ww-safety"},{"name":"Aprons","handle":"app-ww-apron"},{"name":"Medical/Scrubs","handle":"app-ww-med"},{"name":"Tall","handle":"app-ww-tall"}]},{"name":"Personal Protection","handle":"app-pp","children":[{"name":"Face Coverings","handle":"app-pp-mask"},{"name":"Medical/Scrubs","handle":"app-pp-scrun"},{"name":"Safety","handle":"app-pp-safety"}]},{"name":"Ladies/Women","handle":"app-ladies","children":[{"name":"T-Shirts","handle":"app-ladies-ts"},{"name":"Polos/Knits","handle":"app-ladies-pk"},{"name":"Sweatshirts/Fleece","handle":"app-ladies-sf"},{"name":"Woven Dress Shirts","handle":"app-ladies-wds"},{"name":"Caps","handle":"app-ladies-cap"},{"name":"Outerwear","handle":"app-ladies-ow"},{"name":"Activewear","handle":"app-ladies-aw"},{"name":"Bottoms","handle":"app-ladies-btms"},{"name":"Fashion","handle":"app-ladies-fshn"}]},{"name":"Youth","handle":"app-yth","children":[{"name":"T-Shirts","handle":"app-yth-ts"},{"name":"Polos/Knits","handle":"app-yth-pk"},{"name":"Sweatshirts/Fleece","handle":"app-yth-sf"},{"name":"Woven Dress Shirts","handle":"app-yth-wds"},{"name":"Caps","handle":"app-yth-cap"},{"name":"Outerwear","handle":"app-yth-ow"},{"name":"Activewear","handle":"app-yth-aw"},{"name":"Bottoms","handle":"app-yth-btms"},{"name":"Infant & Toddler","handle":"app-yth-inf-tod"}]}]},{"name":"Bags","handle":"bgs","children":[{"name":"Briefcases/Messengers","handle":"bgs-brfcs-mssngr"},{"name":"Backpacks","handle":"bgs-bp"},{"name":"Duffels","handle":"bgs-dffl"},{"name":"Travel Bags","handle":"bgs-trvlbg"},{"name":"Golf Bags","handle":"bgs-glfbg"},{"name":"Cinch Packs","handle":"bgs-cinchbg"},{"name":"Totes","handle":"bgs-tote"},{"name":"Grocery Totes","handle":"bgs-grocerytote"},{"name":"Specialty Bags","handle":"bgs-specialty"},{"name":"Coolers & Lunch Bags","handle":"bgs-lunch"},{"name":"Rolling Bags","handle":"bgs-rllngbg"}]},{"name":"Accessories","handle":"acc","children":[{"name":"Scarves/Gloves","handle":"acc-scar-glve"},{"name":"Towels","handle":"acc-towel","children":[{"name":"Golf Towels","handle":"acc-glftwl"},{"name":"Cooling Towels","handle":"acc-cooltwl"},{"name":"Rally Towels","handle":"acc-rllytwl"},{"name":"Beach Towels","handle":"acc-towel-beach"}]},{"name":"Blankets","handle":"acc-blnkt"},{"name":"Stadium Seats","handle":"acc-stadium"},{"name":"Wallets","handle":"acc-wallets"},{"name":"Umbrellas","handle":"acc-umb"},{"name":"Golf Umbrellas","handle":"acc-glfumb"},{"name":"Golf Accessories","handle":"acc-golf"},{"name":"Robes & Slippers","handle":"acc-robe"}]},{"name":"Drinkware","handle":"dw","children":[{"name":"Accessories","handle":"dw-acc","children":[]},{"name":"Travel Mugs & Tumblers","handle":"dw-tumblers","children":[]},{"name":"Water Bottles","handle":"dw-waterbottles","children":[]},{"name":"Mugs","handle":"dw-mugs","children":[{"name":"Camp Mugs","handle":"dw-campmugs","children":[]},{"name":"Ceramic Coffee Mugs","handle":"dw-cermugs","children":[]}]},{"name":"Plastic Cups","handle":"dw-plastcups","children":[]},{"name":"Jugs","handle":"dw-jugs","children":[]},{"name":"Beverage Holders","handle":"dw-bevholder","children":[{"name":"Koozies","handle":"dw-bev-koozies","children":[]},{"name":"Can Coolers","handle":"dw-bev-cc","children":[]}]},{"name":"Stadium Cups","handle":"dw-stadium","children":[]},{"name":"Shot Glasses","handle":"dw-shotglass","children":[]},{"name":"Glassware","handle":"dw-glass","children":[{"name":"Wine Glasses","handle":"dw-glass-wine","children":[]}]},{"name":"Coasters","handle":"dw-coasters","children":[]}]},{"name":"Safety","handle":"sfty","children":[{"name":"Eye Protection","handle":"sfty-eyes","children":[{"name":"Safety Eyewear","handle":"sfty-eyes-sftyew","children":[]},{"name":"Safety Goggles","handle":"sfty-eyes-sftygog","children":[]},{"name":"Safety Eyewear Accessories","handle":"sfty-eyes-sftyewacc","children":[]},{"name":"Face Protection","handle":"sfty-eyes-sftyfcprot","children":[]}]},{"name":"Hand Protection","handle":"sfty-glvs","children":[{"name":"Chemical Resistant Gloves","handle":"sfty-glvs-chmclrst","children":[]},{"name":"Cold Protection Gloves","handle":"sfty-glvs-cldprot","children":[]},{"name":"Cut Resistant Gloves","handle":"sfty-glvs-cutrst","children":[]},{"name":"Disposable Gloves","handle":"sfty-glvs-disp","children":[]},{"name":"Extended Use Disposable Gloves","handle":"sfty-glvs-extusedisp","children":[]},{"name":"Fabric Work Gloves","handle":"sfty-glvs-fbrwrk","children":[]},{"name":"General Purpose Gloves-Coated","handle":"sfty-glvs-gpurpct","children":[]},{"name":"General Purpose Gloves-Uncoated","handle":"sfty-glvs-gpurp","children":[]},{"name":"Heat Protection Gloves","handle":"sfty-glvs-heatprot","children":[]},{"name":"High Performance Gloves","handle":"sfty-glvs-hghperf","children":[]},{"name":"Leather Drivers Gloves","handle":"sfty-glvs-lthrdrvr","children":[]},{"name":"Leather Palm Gloves","handle":"sfty-glvs-lthrplm","children":[]},{"name":"Metal Mesh Gloves","handle":"sfty-glvs-mtlmsh","children":[]},{"name":"Parade & Uniform Gloves","handle":"sfty-glvs-pardeunfrm","children":[]}]},{"name":"Head Protection","handle":"sfty-hdwr","children":[{"name":"Accessories","handle":"sfty-hdwr-acc","children":[]},{"name":"Bump Caps","handle":"sfty-hdwr-bmpcp","children":[]},{"name":"FR Hoods","handle":"sfty-hdwr-frhds","children":[]},{"name":"Go-To-Work Kits","handle":"sfty-hdwr-wrkkits","children":[]},{"name":"Hard Hats","handle":"sfty-hdwr-hh","children":[]},{"name":"Hood & Paint Caps","handle":"sfty-hdwr-hdpntcps","children":[]},{"name":"Safety Helmets","handle":"sfty-hdwr-sftyhlmnts","children":[]},{"name":"Winter Caps & Liners","handle":"sfty-hdwr-wntrcpslinrs","children":[]}]},{"name":"Protective Clothing","handle":"sfty-app","children":[{"name":"Aprons","handle":"sfty-app-aprn","children":[]},{"name":"Coveralls","handle":"sfty-app-cvrll","children":[]},{"name":"Cut Resistant Wear","handle":"sfty-app-cutresist","children":[]},{"name":"Disposable Clothing","handle":"sfty-app-disposable","children":[]},{"name":"FR Clothing","handle":"sfty-app-fr","children":[]},{"name":"Face Covers","handle":"sfty-app-facecvr","children":[]},{"name":"Hi-Vis Apparel","handle":"sfty-app-hivis","children":[]},{"name":"Hi-Vis Cold Gear","handle":"sfty-app-hivis-cold","children":[]},{"name":"Metal Mesh Clothing","handle":"sfty-app-mtlmsh","children":[]},{"name":"Rainwear","handle":"sfty-app-rnwr","children":[]}]},{"name":"Ear Protection","handle":"sfty-ear","children":[{"name":"Earplugs","handle":"sfty-ear-plugs","children":[]}]},{"name":"Tools","handle":"sfty-tools","children":[{"name":"Multi-Tools","handle":"sfty-tools-multi","children":[]},{"name":"Screwdrivers","handle":"sfty-tools-scrwdrvr","children":[]}]},{"name":"Kits","handle":"sfty-kits","children":[{"name":"First Aid Kits","handle":"sfty-kits-1staid","children":[]}]}]},{"name":"Golf","handle":"golf","children":[{"name":"Golf Balls","handle":"golf-balls","children":[]},{"name":"Golf Towels","handle":"golf-towels","children":[]},{"name":"Divot Tools","handle":"golf-divot","children":[]},{"name":"Golf Umbrellas","handle":"golf-umb","children":[]},{"name":"Golf Accessories","handle":"golf-acc","children":[]},{"name":"Golf Tees","handle":"golf-tees","children":[]}]},{"name":"Promotional Products","handle":"pp","children":[{"name":"Desk & Office","handle":"pp-off","children":[{"name":"Journals & Notebooks","handle":"pp-off-journals","children":[]},{"name":"Pens & Writing Instruments","handle":"pp-off-pens","children":[]},{"name":"Sticky Pads","handle":"pp-off-stckypds","children":[]},{"name":"Padfolios","handle":"pp-off-padf","children":[]},{"name":"Computer Accessories","handle":"pp-off-compacc","children":[]},{"name":"Clips & Magnets","handle":"pp-off-clips","children":[]}]},{"name":"Kits","handle":"pp-kits","children":[{"name":"First Aid Kits","handle":"pp-kits-1staid","children":[]}]},{"name":"Outdoor & Leisure","handle":"pp-outdoor","children":[{"name":"Cooling Products","handle":"pp-outdoor-cooling","children":[{"name":"Cooling Neck Wraps","handle":"pp-outdoor-cooling-neck","children":[]},{"name":"Cooling Towels","handle":"pp-outdoor-cooling-twl","children":[]}]},{"name":"Chairs & Stadium Seats","handle":"pp-outdoor-chairs","children":[]},{"name":"Umbrellas","handle":"pp-outdoor-umb","children":[]}]},{"name":"Keychains","handle":"pp-keychain","children":[]},{"name":"Microfiber Cloths","handle":"pp-mfcloth","children":[]},{"name":"Stress Relievers","handle":"pp-stressrelivers","children":[]},{"name":"Tech","handle":"pp-tech","children":[{"name":"USBs","handle":"pp-tech-usb","children":[]},{"name":"Power Banks","handle":"pp-tech-pb","children":[]},{"name":"Wireless Chargers","handle":"pp-tech-wc","children":[]}]},{"name":"Badges & Lanyards","handle":"pp-lnyrd","children":[]},{"name":"Tote Bags","handle":"pp-tote","children":[]},{"name":"Beverage Holders","handle":"pp-bevholder","children":[{"name":"Koozies","handle":"pp-bev-koozie","children":[]}]},{"name":"Tools & Lights","handle":"pp-tools","children":[{"name":"Flashlights","handle":"pp-tools-fl","children":[]},{"name":"Bottle Openers","handle":"pp-tools-btlopnr","children":[]},{"name":"Carabiner","handle":"pp-tools-carabiner","children":[]}]},{"name":"Personal Care","handle":"pp-prsnlcr","children":[{"name":"Lip Balms & Lip Moisturizers","handle":"pp-prsnlcr-lb"},{"name":"Sunscreens","handle":"pp-prsnlcr-ss"}]}]},{"name":"Outdoor & Leisure","handle":"odl","children":[{"name":"Chairs & Stadium Seats","handle":"odl-css","children":[{"name":"Chairs","handle":"odl-css-chairs","children":[]},{"name":"Stadium Seats","handle":"odl-css-ss","children":[]}]},{"name":"Coolers","handle":"odl-coolers","children":[{"name":"Hard Coolers","handle":"odl-coolers-hard","children":[]},{"name":"Soft Coolers","handle":"odl-coolers-soft","children":[]}]},{"name":"Umbrellas","handle":"odl-umb","children":[]},{"name":"Towels","handle":"odl-towel","children":[{"name":"Beach Towels","handle":"odl-towel-beach","children":[]}]}]},{"name":"Desk & Office","handle":"off","children":[{"name":"Journals & Notebooks","handle":"off-journals","children":[]},{"name":"Tally Books","handle":"off-tallybks","children":[]},{"name":"Pens & Writing Instruments","handle":"off-pens","children":[]},{"name":"Mousepads","handle":"off-mousepads","children":[]},{"name":"USBs","handle":"off-usb","children":[]},{"name":"Padfolios","handle":"off-padf","children":[]},{"name":"Computer Accessories","handle":"off-compacc","children":[]},{"name":"Badges & Lanyrds","handle":"off-lnyrd","children":[]},{"name":"Print Products","handle":"off-print","children":[]},{"name":"Clips & Magnets","handle":"off-clips","children":[]},{"name":"Sticky Pads","handle":"off-stckypds","children":[]}]},{"name":"Tech","handle":"tech","children":[{"name":"USBs","handle":"tech-usb","children":[]},{"name":"Power Banks","handle":"tech-pb","children":[]},{"name":"Wireless Chargers","handle":"tech-wc","children":[]},{"name":"Headphones & Earbuds","handle":"tech-eb","children":[]},{"name":"Speakers","handle":"tech-spkr","children":[]}]},{"name":"Home & Auto","handle":"home","children":[{"name":"Keychains","handle":"home-kc","children":[]},{"name":"Kitchen Accessories","handle":"home-kitchenacc","children":[{"name":"Magnets & Clips","handle":"home-kitchenacc-clips","children":[]},{"name":"Bottle & Jar Openers","handle":"home-kitchenacc-open","children":[]}]}]},{"name":"Packs","handle":"packs","children":[]},{"name":"Business Cards","handle":"busicards","children":[]},{"name":"Years of Service/Awards","handle":"yos-awrds","children":[{"name":"5 Years","handle":"yos-awrds-5yr","children":[]},{"name":"10 Years","handle":"yos-awrds-10yr","children":[]},{"name":"15 Years","handle":"yos-awrds-15yr","children":[]},{"name":"20 Years","handle":"yos-awrds-20yr","children":[]},{"name":"25 Years","handle":"yos-awrds-25yr","children":[]},{"name":"30 Years","handle":"yos-awrds-30yr","children":[]},{"name":"35 Years","handle":"yos-awrds-55yr","children":[]},{"name":"All Awards","handle":"yos-awrds-allawrds","children":[]}]}]

let categories = {
    default: default_categories,
    verifySelected( selected, all_categories ){
        all_categories.forEach(category => {
            categories.recursiveTraverseWithParents(selected, category, []);
        });
    },
    recursiveTraverseWithParents(selected, node, parents = []) {
        if( selected.includes(node.handle) ) {
            parents.forEach( p => {
                if( !selected.includes(p.handle) ) selected.push(p.handle);
            })
        }

        if (node.children && node.children.length > 0) {
            parents.push(node);
            node.children.forEach(child => categories.recursiveTraverseWithParents(selected, child, [...parents]));
            parents.pop();
        }
    }
}

function create()
{
    return {
        id: null,
        magento_id: null,
        name: '',
        sku: '',
        status: 'enabled',
        data: {
            info: {
                description: '',
                decoration_group: 'default-promo'
            },
            pricing: {
                dynamic: { decorator: [] }
            },
            external: {}
        },
        company: null,
        categories: [],
    }
}

function createFromSage( sage_product )
{
    let data = {
        entities: {
            product: {},
            variants: []
        },
        available: {
            colors: [],
            sizes: [],
            images: [],
            cost: []
        }
    }

    let product = create();
    product.sku = sage_product.itemNum;
    product.name = sage_product.prName;
    product.data.info.description = sage_product.description;

    if( sage_product.supplier && sage_product.supplier.coName ){
        product.company = {
            id: null,
            name: sage_product.supplier.coName,
            sage_id: sage_product.supplier.suppId
        }
    }

    let options = sage.getOptions( sage_product );
    let cost = sage.getCostTiers( sage_product );
    if( cost.length ){
        cost = [cost[cost.length-1]];
        cost[0].qty = 1;
    }

    options.colors.forEach( c => {
        data.available.colors.push({
            name: c.name.trim(),
            image: '',
            allowed_logo_types: [],
            color_parent: c.name.trim()
        })
    })

    options.sizes.forEach( s => {
        data.available.sizes.push(s)
    })

    if( sage_product.pics && sage_product.pics.length > 0 ){

        sage_product.pics.forEach( p => {

            let found = data.available.colors.filter( c => {
                let picture = p.caption.trim().toLowerCase();
                let color = c.name.toLowerCase();
                return picture.includes(color)
            })

            if( found.length )
                found[0].image = p.url;

            data.available.images.push({
                url: p.url,
                title: p.caption,
            });
        })
    }

    data.available.images.push({
        title: 'Custom URL',
        url: '',
    })

    product.data.external.sage = sage_product;
    data.entities.product = product;
    data.available.cost = cost;

    console.log('data after migration', data);

    return data;
}


export default {
    create,
    createFromSage,
    categories,
    placement: ProductPlacement,
    variant: productVariant,
    personalization: productPersonalization,
}