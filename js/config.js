var restheart_config = {
    base_url: "http://<HOST>:<PORT>/<MONGO_DB>/",
    username: "<USERNAME>",
    password: "<USERNAME"
}

var epu_config_default = {
    date_from: (new Date(new Date().getTime() - ((new Date().getDay())-1) * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10),
    date_until: (new Date(new Date().getTime() + (7-(new Date().getDay())) * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10),
    trackers: "<TRACKER>,<TRACKER>,<TRACKER>,...",
    planned_date_fields: "<DATE_FIELD>,<DATE_FIELD>,<DATE_FIELD>,..."
};
