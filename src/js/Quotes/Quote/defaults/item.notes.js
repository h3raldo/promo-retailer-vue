let flags = [
    {
        name: 'Require Proof',
        value: 'RP',
        selected: false,
    },
    {
        name: 'Needs Package',
        value: 'NP',
        selected: false,
    }
]

export default {
    flags(){
        return flags;
    }
}