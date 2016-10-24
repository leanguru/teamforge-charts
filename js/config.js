var restheart_config = {
    base_url: "http://teamforge-charts.leanguru.pro:8080/cfdtest/",
    username: "cfdtest",
    password: "CapSSA113"
}

var epu_config_default = {
    date_from: (new Date(new Date().getTime() - ((new Date().getDay())-1) * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10),
    date_until: (new Date(new Date().getTime() + (7-(new Date().getDay())) * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10),
    trackers: "tracker88228,tracker89256,tracker96175",
    planned_date_fields: "plannedDate,plannedDate,dataDeEntrega" 
};
