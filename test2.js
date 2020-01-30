const got = require('got'), tunnel=require('tunnel');

(async ()=>{
    try {
    console.log(await got('ip138.com'
    , {
        agent: tunnel.httpOverHttp({
            proxy: {
                host: '47.111.181.100',
                port:'3128'
            }
        }),
        timeout:3000
    }
    ));
    } catch(e) {console.error(e)}
})()
