interface Records {
    id: number;
    age: number;
    name: string;
    category: string;
    phone: string;
    actions?: any;
}

interface ExpandableRecords {
    id: number;
    age: number;
    name: string;
    category: string;
    phone: string;
    subRows: Records[];
}

const handleDelete = (data:any) => {
    console.log(data)
}

const records: Records[] = [
    {
        id: 1,
        age: 32,
        name: 'Burt',
        category: 'Kaggle',
        phone: '+1 (823) 532-2427',
       
    },

];

const expandableRecords: ExpandableRecords[] = [
    {
        id: 1,
        age: 32,
        name: 'Burt',
        category: 'Kaggle',
        phone: '+1 (823) 532-2427',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 2,
        age: 23,
        name: 'Long',
        category: 'Magmina',
        phone: '+1 (813) 583-2089',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 3,
        age: 31,
        name: 'Alvarado',
        category: 'Translink',
        phone: '+1 (975) 468-3875',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 4,
        age: 24,
        name: 'Lilia',
        category: 'Digitalus',
        phone: '+1 (891) 537-3461',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 5,
        age: 25,
        name: 'Amanda',
        category: 'Bunga',
        phone: '+1 (916) 522-3747',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 6,
        age: 20,
        name: 'Alexandra',
        category: 'Conjurica',
        phone: '+1 (876) 492-3181',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 7,
        age: 27,
        name: 'Diana',
        category: 'Extragen',
        phone: '+1 (977) 417-3038',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 8,
        age: 26,
        name: 'Goodman',
        category: 'Aquamate',
        phone: '+1 (930) 545-2289',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 9,
        age: 26,
        name: 'Edith',
        category: 'Pyrami',
        phone: '+1 (854) 506-3468',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 10,
        age: 29,
        name: 'Juana',
        category: 'Singavera',
        phone: '+1 (872) 560-2324',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 11,
        age: 21,
        name: 'Fitzgerald',
        category: 'Dancerity',
        phone: '+1 (813) 573-2507',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 12,
        age: 38,
        name: 'Madden',
        category: 'Corpulse',
        phone: '+1 (935) 534-3876',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 13,
        age: 40,
        name: 'Jewell',
        category: 'Frenex',
        phone: '+1 (886) 516-3262',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 14,
        age: 32,
        name: 'Kerr',
        category: 'Artiq',
        phone: '+1 (807) 561-3077',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 15,
        age: 20,
        name: 'Washington',
        category: 'Organica',
        phone: '+1 (948) 458-3517',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 16,
        age: 20,
        name: 'Audrey',
        category: 'Softmicro',
        phone: '+1 (900) 592-3841',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 17,
        age: 39,
        name: 'Allison',
        category: 'Playce',
        phone: '+1 (998) 478-3810',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 18,
        age: 25,
        name: 'Holder',
        category: 'Paragonia',
        phone: '+1 (850) 536-2708',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 19,
        age: 26,
        name: 'Atkinson',
        category: 'Scentric',
        phone: '+1 (850) 467-2761',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 20,
        age: 35,
        name: 'Delaney',
        category: 'Telpod',
        phone: '+1 (934) 468-2218',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 21,
        age: 20,
        name: 'Myrna',
        category: 'Zanity',
        phone: '+1 (953) 565-3836',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 22,
        age: 30,
        name: 'Erna',
        category: 'Techade',
        phone: '+1 (872) 574-3879',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 23,
        age: 36,
        name: 'Fannie',
        category: 'Cubix',
        phone: '+1 (843) 576-2904',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 24,
        age: 38,
        name: 'Melody',
        category: 'Talae',
        phone: '+1 (817) 424-3500',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 25,
        age: 27,
        name: 'Letitia',
        category: 'Enjola',
        phone: '+1 (857) 441-2917',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 26,
        age: 33,
        name: 'Nina',
        category: 'Eventex',
        phone: '+1 (917) 599-2793',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 27,
        age: 40,
        name: 'Byrd',
        category: 'Obones',
        phone: '+1 (846) 422-2064',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 28,
        age: 34,
        name: 'Chen',
        category: 'Dadabase',
        phone: '+1 (956) 474-3409',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 29,
        age: 25,
        name: 'Alexandria',
        category: 'Turnabout',
        phone: '+1 (964) 415-2278',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 30,
        age: 37,
        name: 'Page',
        category: 'Metroz',
        phone: '+1 (897) 541-2460',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 31,
        age: 24,
        name: 'Clare',
        category: 'Zilch',
        phone: '+1 (832) 591-3814',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 32,
        age: 38,
        name: 'Lindsey',
        category: 'Roughies',
        phone: '+1 (942) 579-2920',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 33,
        age: 32,
        name: 'Oconnor',
        category: 'Kinetica',
        phone: '+1 (899) 599-3206',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 34,
        age: 35,
        name: 'Maldonado',
        category: 'Zentime',
        phone: '+1 (955) 419-2815',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 35,
        age: 25,
        name: 'Day',
        category: 'Eargo',
        phone: '+1 (895) 555-2916',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 36,
        age: 20,
        name: 'Collier',
        category: 'Phuel',
        phone: '+1 (998) 468-2079',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 37,
        age: 40,
        name: 'Jeannette',
        category: 'Entogrok',
        phone: '+1 (904) 567-2078',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 38,
        age: 33,
        name: 'Wallace',
        category: 'Nurali',
        phone: '+1 (877) 566-3957',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 39,
        age: 39,
        name: 'Mcfadden',
        category: 'Cincyr',
        phone: '+1 (949) 405-3992',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
    {
        id: 40,
        age: 21,
        name: 'Chrystal',
        category: 'Futurize',
        phone: '+1 (988) 458-3032',
        subRows: [
            {
                id: 51,
                age: 23,
                name: 'Bruno',
                category: 'Magmina',
                phone: '+1 (813) 583-2089',
            },
        ],
    },
];
export { records, expandableRecords };
