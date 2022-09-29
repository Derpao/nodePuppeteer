import { MongoClient } from 'mongodb';

const client = await MongoClient.connect('mongodb+srv://derpao:Derpao1150@derpao.5bu5jxd.mongodb.net/football?retryWrites=true&w=majority');
async function mongoDb (){
    try {
        
        const db = client.db();
        const footballCorrection = db.collection('football');
        // const filter = { title: 'api-football' };
       

        const result = await footballCorrection.find().toArray().then(x => x[0]);
       
        console.log (result.timeUpdated);
       
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }

    mongoDb ();