import itemOption from "@/js/Quotes/Quote/entity/item.option.js";
import itemDecoration from "@/js/Quotes/Quote/entity/item.decoration.js";
import defaults from "@/js/Quotes/Quote/defaults.js";

export default {
    create(){
        let item = {
            id: '',
            info: {
                name: 'New Item',
                sku: '',
                hidden: false,
                taxable: true,
                image: {
                    primary: '',
                    available: []
                },
                supplier: {}
            },
            notes: {
                public: '',
                private: '',
                flags: []
            },
            qty: 1,
            options: [],
            colors: [],
            sizes: [],
            decoration: {
                available: [],
                placements: [],
            },
            subitems: [],
            pricing: {
                totals: {
                    price: 0,
                    cost: 0
                },
                base: {
                    material: {
                        cost: 0,
                        price: 0,
                        overwrites: {
                            decoration: false,
                            color: false,
                            size: false,
                            options: false
                        }
                    },
                    decoration: {
                        cost: 0,
                        price: 0
                    }
                }
            },
            cost: {
                material: {
                    visible: true,
                    tiers: []
                },
                combined: {
                    tiers: []
                }
            }
        };
        item.colors.push(this.color.create());
        item.sizes.push(this.size.create());
        item.subitems.push(this.subitem.create());
        return item;
    },
    color: {
        create(){
            return {
                name: 'OC',
                cost: []
            }
        }
    },
    size: {
        create(s){
            return {
                name: s ?? 'OS',
                cost: []
            }
        }
    },
    image: {
        create(){
            return { url: '', caption: '' }
        }
    },
    subitem:{
        create(){
            return {
                qty: 1,
                options: {},
                color: {},
                sizes: {},
                pricing: {
                    totals: {
                        cost: 0,
                        price: 0
                    },
                    base: {
                        color: {
                            cost: 0,
                            price: 0
                        },
                        options: {
                            cost: 0,
                            price: 0
                        }
                    }
                },
            }
        },
        size: {
            create( size ){
                return {
                    name: size,
                    qty: 0,
                    pricing: {
                        totals: {
                            cost: 0,
                            price: 0,
                            each: {
                                cost: 0,
                                price: 0
                            }
                        },
                        base: {
                            size: {
                                cost: 0,
                                price: 0
                            }
                        }
                    }
                }
            }
        }
    },
    tier: {
        create(){
            return { qty: 1, price: 0, cost: 0, margin: defaults.item.margin, fixed: false }
        }
    },
    option: itemOption,
    decoration: itemDecoration
}