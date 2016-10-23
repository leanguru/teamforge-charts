var restheart_config = {
    base_url: "https://<HOST>:<PORT>/<MONGO_DB>/",
    username: "<USERNAME>",
    password: "<PASSWORD>"
}

var cpe_config_default = {
    date_from: (new Date(new Date().getTime() - (1-(new Date().getDay())) * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10),
    date_until: (new Date(new Date().getTime() + (7-(new Date().getDay())) * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10),
    trackers: [
        {id: '<TRACKER>', planned_date_field:'<FIELDNAME>'},
        {id: '<TRACKER>', planned_date_field:'<FIELDNAME>'}
    ]
};