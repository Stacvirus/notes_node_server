const { info } = require('./utils/logger');
const config = require('./utils/config');
const app = require('./app');

const port = config.PORT;
app.listen(port, () => {
    info('server running on port', port);
});

// mongodb+srv://stacvirus:<password>@phonebookdb.gxpazuz.mongodb.net/
// 2TDa5tq7YhCZeikT
