
/*
client.on('channelUpdate',(event)=>{
        console.log(event);
});

 
    
    let connection:  VoiceConnection;
    let dispatcher:  BroadcastDispatcher;




    client.on('message', async message =>{
        if(message.author.bot){ return }
        if(!message.content.startsWith(config.prefix)) { return }

        
        if (message.member.voice.channel) {

            if(message.content === `${config.prefix} join`){
                connection = await message.member.voice.channel.join();

                
                
                message.channel.send(`${message.author.username} use a join command`);
                console.log(`Join`);
    
            }

           



            if(message.content === `${config.prefix} play`){
                if (!connection){
                    connection = await message.member.voice.channel.join();
                }
                
                dispatcher = connection.play(path.join(__dirname, `/audio/podria_ser_v3.wav`), {volume:1});
                //connection.play(broadcast01);

                dispatcher.on('start', () => {
                    console.log(`Audio is now playing on channel! ${message.member.voice.channel.name}`);
                });

                dispatcher.on('finish', () => {
                    console.log(`Audio has finished playing on channel! ${message.member.voice.channel.name}`);
                });

                
            
                        // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
                        
                message.channel.send(`${message.author.username} use a play command`);

            }

            if(message.content === `${config.prefix} stop`){
                dispatcher.destroy();
                message.channel.send(`${message.author.username} use a stop command`);
                console.log(`Audio stopped`);
     
            }

        

            if(message.content === `${config.prefix} playlive`){

                if (!connection){
                    connection = await message.member.voice.channel.join();
                }
                
                
                const audioUsuario = connection.receiver.createStream(message.author.id, { mode:'opus' , end:'manual' });

                const broadcast1 = client.voice.createBroadcast();
                const broadcast2 = client.voice.createBroadcast();

                console.log('client : ',client.voice );

                

                broadcast1.play(audioUsuario, { type:'opus', volume:.1});

                broadcast2.play(path.join(__dirname, `/audio/nada_personal_v01.wav`));

            
                        // Always remember to handle errors appropriately!
                        
                connection.play(broadcast1);
                
                message.channel.send(`${message.author.username} use a playlive command`);
     
            }

            

            
        }

        if(message.content === `${config.prefix} playAll`){
            const broadcast = client.voice.createBroadcast();
            broadcast.play(path.join(__dirname, `/audio/nada_personal_v01.wav`), {volume:1});
            // Play "music.mp3" in all voice connections that the client is in
            for (const connection of client.voice.connections.values()) {
                connection.play(broadcast);
            }

           
                    
            message.channel.send(`${message.author.username} use a play all command`);
        }
       

      
    });



*/

       /*

        let Guild_roles = message.guild.roles;
        
        let Guild_members = message.guild.members;
        
        let Guild_channels = message.guild.channels;

        function getRoles( rolesList: Discord.RoleManager | Discord.GuildMemberRoleManager ){
            let rolesForServer:any = [];

            rolesList.cache.forEach( role => {
                let roleFound = {
                    roleName: role.name,
                    //roleId: role.id,
                    //rolePermissions:JSON.stringify(role.permissions.toArray())
                }
    
                //rolesForServer.push(roleFound);
                rolesForServer.push(role.name);
    
            });

            return rolesForServer;

        }

        function getPermissions( permissions:Discord.Permissions ){

            let permissionData:any = [];


        }


        

        let serverInfoJson = {
            roles: getRoles(message.guild.roles),
            
        }
*/

        //console.log(serverInfoJson);

        //let roleForechange = message.member.roles.cache.find(roleVal => roleVal.name === "Multi_Task");

        //console.log(roleForechange.permissions);
        /*
        roleForechange.edit({
            color:'#84ce29'
        });
        /*

        var colors = ['#8585ff','#fff681','#a073fd','#fd73b9'];
        var random = Math.floor(Math.random() * colors.length);

        messageJson.roles.for_edit.edit({
            color: colors[random]
        })

        */

  /*
        if (message.content === 'nos espían'){
            setTimeout(() => {
                message.channel.send('Digan no al spam hermanos bonobos')
            }, 120000);
            
        }

        */



         /*
        if(  message.author.id !== '592539212906233882' ){

            return;
        }

        
//------------------------------------------------------


        var members = await message.guild.members.fetch()

        let membersFromServer:any = []

        members.forEach(member => {

            if(!member.roles.cache.has('710650474877157397')){
                return;
            }

            let memberFound = {
                //id: member.id,
                username: member.user.username,
                roles:JSON.stringify( getRoles(member.roles))
            }

            if(member.roles.cache.has('742860718650425395') && member.roles.cache.has('710650474877157397') ){
                console.log(`(Eliminar 1)  australopitecus  + Bonobo  ${JSON.stringify( getRoles(member.roles))}`);
                //member.roles.remove(['742860718650425395','684255900323938324']);
                //member.roles.remove('742860718650425395');

                return;
            }

            else if(!member.roles.cache.has('742860718650425395') && member.roles.cache.has('710650474877157397') ){
                console.log(`(Eliminar 0) Bonobo  ${JSON.stringify( getRoles(member.roles))}`);
                //member.roles.remove('742860718650425395');
                return;
            }

          
            
            
            
            membersFromServer.push(memberFound)
        })

        console.log(membersFromServer)

// ____________________________________

\u200B
Rᴇɢʟᴀ **#2**
${'```𝑁𝑜 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑁𝑆𝐹𝑊 𝑒𝑥𝑐𝑒𝑝𝑡𝑜 𝑒𝑛 #🍌ℎ𝑒𝑑𝑜𝑛𝑖𝑠𝑚𝑜🍑, 𝑒𝑙 𝐶ℎ𝑖𝑙𝑑𝑃𝑜𝑟𝑛 𝑦 𝑒𝑙 𝑔𝑜𝑟𝑒 𝑒𝑠𝑡𝑎𝑛 𝑡𝑒𝑟𝑚𝑖𝑛𝑎𝑛𝑡𝑒𝑚𝑒𝑛𝑡𝑒 𝑝𝑟𝑜ℎ𝑖𝑏𝑖𝑑𝑜𝑠.```'}
\u200B
Rᴇɢʟᴀ **#3**
${'```𝑇𝑜𝑑𝑜 𝑎𝑝𝑜𝑟𝑡𝑒 𝑑𝑒𝑏𝑒 𝑠𝑒𝑟 𝑐𝑜𝑚𝑝𝑎𝑟𝑡𝑖𝑑𝑜 𝑒𝑛 𝑠𝑢𝑠 𝑟𝑒𝑠𝑝𝑒𝑐𝑡𝑖𝑣𝑜𝑠 𝑐𝑎𝑛𝑎𝑙𝑒𝑠, 𝑝𝑎𝑟𝑎 𝑚𝑎́𝑠 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑐𝑖𝑜́𝑛 𝑙𝑒𝑎 𝑙𝑎 𝑔𝑢𝑖́𝑎 𝑑𝑒 𝑐𝑎𝑛𝑎𝑙𝑒𝑠 𝑞𝑢𝑒 𝑒𝑠𝑡𝑎 𝑒𝑛 #❔𝑠𝑜𝑏𝑟𝑒_𝑒𝑙_𝑠𝑒𝑟𝑣𝑖𝑑𝑜𝑟, 𝑎𝑠𝑖́ 𝑚𝑖𝑠𝑚𝑜 𝑙𝑒𝑎 𝑙𝑎 𝑔𝑢𝑖́𝑎 𝑑𝑒 𝑐𝑜𝑚𝑎𝑛𝑑𝑜𝑠 𝑑𝑒 𝑏𝑜𝑡𝑠 𝑝𝑎𝑟𝑎 𝑠𝑎𝑏𝑒𝑟 𝑐𝑜𝑚𝑜 𝑦 𝑑𝑜𝑛𝑑𝑒 𝑢𝑡𝑖𝑙𝑖𝑧𝑎𝑟𝑙𝑜𝑠.```'}
\u200B
Rᴇɢʟᴀ **#4**
${'```𝐸𝑠 𝑝𝑟𝑖𝑜𝑟𝑖𝑡𝑎𝑟𝑖𝑜 𝑒𝑙 𝑟𝑒𝑠𝑝𝑒𝑡𝑜 𝑚𝑢𝑡𝑢𝑜 𝑎𝑙 𝑚𝑜𝑑𝑜 𝑑𝑒 𝑒𝑥𝑝𝑟𝑒𝑠𝑎𝑟𝑠𝑒, 𝑝𝑜𝑟 𝑓𝑎𝑣𝑜𝑟, 𝑑𝑒𝑗𝑒 𝑙𝑎𝑠 𝑖𝑑𝑒𝑎𝑠 𝑟𝑎𝑑𝑖𝑐𝑎𝑙𝑒𝑠 𝑜 𝑙𝑎 𝑝𝑟𝑜𝑝𝑎𝑔𝑎𝑛𝑑𝑎 𝑝𝑎𝑟𝑎 𝑂𝑡𝑟𝑎𝑠 𝑅𝑒𝑑𝑒𝑠, 𝑙𝑎 𝑝𝑢𝑏𝑙𝑖𝑐𝑖𝑑𝑎𝑑 𝑛𝑜 𝑒𝑠𝑡𝑎 𝑎𝑢𝑡𝑜𝑟𝑖𝑧𝑎𝑑𝑎 𝑎 𝑚𝑒𝑛𝑜𝑠 𝑞𝑢𝑒 𝑠𝑒𝑎 𝑐𝑜𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑜 𝑑𝑒 𝑙𝑎 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑐𝑖𝑜́𝑛 𝑒𝑠𝑡𝑜 𝑖𝑛𝑐𝑙𝑢𝑦𝑒 𝑜𝑡𝑟𝑜𝑠 𝑠𝑒𝑟𝑣𝑖𝑑𝑜𝑟𝑒𝑠.```'}
\u200B
Rᴇɢʟᴀ **#5**
${'```𝑁𝑎𝑑𝑎 𝑑𝑒 𝑛𝑜𝑚𝑏𝑟𝑒𝑠 𝑐𝑜𝑛 𝑠𝑖́𝑚𝑏𝑜𝑙𝑜𝑠 𝑒𝑥𝑡𝑟𝑎𝑣𝑎𝑔𝑎𝑛𝑡𝑒𝑠 𝑜 𝑓𝑜𝑡𝑜𝑠 𝑑𝑒 𝑝𝑒𝑟𝑓𝑖𝑙 𝑁𝑆𝐹𝑊.```'}
\u200B
Rᴇɢʟᴀ **#6**
${'```𝐻𝑎𝑦 𝑢𝑛 𝑙𝑖𝑚𝑖𝑡𝑒 𝑑𝑒 20 𝑒𝑚𝑜𝑗𝑖𝑠 𝑝𝑜𝑟 𝑐𝑜𝑚𝑒𝑛𝑡𝑎𝑟𝑖𝑜, 𝑛𝑜 𝑎𝑏𝑢𝑠𝑒 𝑑𝑒 𝑒𝑙𝑙𝑜𝑠 𝑦 𝑠𝑜𝑙𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑖𝑟𝑎́𝑛 𝑑𝑜𝑠 𝑐𝑢𝑒𝑛𝑡𝑎𝑠 𝑝𝑜𝑟 𝑝𝑒𝑟𝑠𝑜𝑛𝑎.```'}
\u200B
Rᴇɢʟᴀ **#7**
${'```𝑆𝑖 𝑑𝑒𝑠𝑒𝑎 ℎ𝑎𝑐𝑒𝑟 𝑢𝑛 𝑎𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑 𝑓𝑜𝑟𝑚𝑎𝑙 𝑑𝑒𝑏𝑒 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑟𝑙𝑜 𝑐𝑜𝑛 𝑝𝑟𝑒𝑣𝑖𝑜 𝑎𝑣𝑖𝑠𝑜, 𝑙𝑎𝑠 𝑎𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑𝑒𝑠 𝑑𝑒 -𝑚𝑒𝑛𝑜𝑠 𝑑𝑒 40 𝑚𝑖𝑛𝑢𝑡𝑜𝑠- 𝑝𝑢𝑒𝑑𝑒𝑛 𝑠𝑒𝑟 𝑟𝑒𝑎𝑙𝑖𝑧𝑎𝑑𝑎𝑠 𝑠𝑖𝑛 𝑝𝑟𝑒𝑣𝑖𝑜 𝑎𝑣𝑖𝑠𝑜 𝑠𝑖𝑒𝑚𝑝𝑟𝑒 𝑦 𝑐𝑢𝑎𝑛𝑑𝑜 𝑠𝑒𝑎 𝑒𝑛 𝑠𝑢 𝑟𝑒𝑠𝑝𝑒𝑐𝑡𝑖𝑣𝑜 𝑐𝑎𝑛𝑎𝑙.```'}
\u200B
Rᴇɢʟᴀ **#8**
${'```𝐴𝑏𝑠𝑡𝑒́𝑛𝑔𝑎𝑠𝑒 𝑑𝑒 𝑠𝑒𝑟 𝑑𝑒𝑚𝑎𝑠𝑖𝑎𝑑𝑜 𝑜𝑏𝑠𝑡𝑖𝑛𝑎𝑑𝑜 𝑐𝑜𝑛 𝑎𝑙𝑔𝑢́𝑛 𝑡𝑒𝑚𝑎 𝑜 𝑎𝑐𝑐𝑖𝑜́𝑛 𝑢𝑛𝑎 𝑣𝑒𝑧 𝑠𝑒 𝑙𝑒 𝑎𝑑𝑣𝑖𝑒𝑟𝑡𝑎 𝑞𝑢𝑒 𝑙𝑎𝑠 𝑙𝑙𝑒𝑣𝑒 𝑎 𝑜𝑡𝑟𝑎 𝑝𝑎𝑟𝑡𝑒 𝑝𝑜𝑟 𝑒𝑙 𝑏𝑖𝑒𝑛 𝑑𝑒𝑙 𝑜𝑟𝑑𝑒𝑛 𝑑𝑒 𝑙𝑎 𝑐𝑜𝑚𝑢𝑛𝑖𝑑𝑎𝑑.```'}
\u200B
Rᴇɢʟᴀ **#9**
${'```𝑁𝑜 𝑠𝑒 𝑡𝑜𝑙𝑒𝑟𝑎𝑟𝑎 𝑒𝑙 𝑎𝑐𝑜𝑠𝑜 𝑎 𝑜𝑡𝑟𝑜𝑠 𝑚𝑖𝑒𝑚𝑏𝑟𝑜𝑠 𝑑𝑒𝑙 𝑠𝑒𝑟𝑣𝑖𝑑𝑜𝑟, 𝑎𝑛𝑡𝑒 𝑢𝑛 𝑐𝑎𝑠𝑜 𝑐𝑜𝑚𝑝𝑟𝑜𝑏𝑎𝑑𝑜 𝑑𝑒 𝑎𝑐𝑜𝑠𝑜 𝑙𝑎 𝑝𝑒𝑟𝑠𝑜𝑛𝑎 𝑠𝑒𝑟𝑎 𝑒𝑥𝑝𝑢𝑙𝑠𝑎𝑑𝑎 𝑦 𝑠𝑒 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑟𝑎́ 𝑎𝑙 𝑒𝑞𝑢𝑖𝑝𝑜 𝑑𝑒 𝑑𝑖𝑠𝑐𝑜𝑟𝑑.```'}

*/