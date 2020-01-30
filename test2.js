const got = require('got'), tunnel=require('tunnel');

(async ()=>{
    try {
    console.log(await got('27.102.102.50:7006'
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
