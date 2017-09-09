/**
 * Created by Pinto on 02/07/2016.
 */
module.exports = {
    start: function(){
        var lines = process.stdout.getWindowSize()[1];
        var l = "";
        for(var i = 0; i < lines; i++) {
            l+='\r\n';
        }

        console.log((l + "\n" +
        "               ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ\n"+
        "               ZZZZZZZZ                             ZZZZZZZZZZZ\n"+
        "               ZZZZZZ           IOT MAP API           ZZZZZZZZZ\n"+
        "               ZZZZZZZZ                             ZZZZZZZZZZZ\n"+
        "               ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ\n\n\n\n\n").red);

        console.log(("APP STARTUP...").yellow);
        console.log(("DATABASE CONNECTION...").yellow);
    },

    startDatabase: function(connection){
        connection.connect(function(err){
            if(err) {
                console.log(("DATABASE CONNECTION: " + err.errno).red);
                console.log(("APP NOT READY").red);
                process.exit(1);
            }else {
                console.log(("DATABASE CONNECTED AT " + process.env.DB_HOST.toUpperCase() + ":" + process.env.DB_PORT).green);
                console.log(("------> APP STARTED AT " + process.env.HTTP_HOST.toUpperCase() + ":" + process.env.HTTP_PORT).green);
                console.log(("------> DB_INSTANCE = " + process.env.DB_INSTANCE.toUpperCase()).green);
            }
        });
    }
}