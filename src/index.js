app = require("./core/app");


//подключение тестового модуля
require("./modules/file/module");
require("./modules/specialisation/module");
require("./modules/employee/module");
require("./modules/auth/module");
//запуск приложения
app.start();
