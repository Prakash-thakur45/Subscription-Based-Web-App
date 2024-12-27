import Pricing from "../components/ui/Pricing/Pricing";
import {upsertPriceRecord, upsertProductRecord } from "../lib/action";
import { auth } from "../lib/auth";
import {getProducts} from '../lib/data'
import styles from "./home.module.css";


const Home=async()=> {
   await upsertProductRecord();
   await upsertPriceRecord();
   const user=await auth();
   const products= await getProducts();
  //  console.log('products',products);

  return (

            <div className={styles.container}>
           
            <Pricing products={products?? []}
                     user={user}
           />
            {/* <Pricing /> */}

           </div>
  );
}

export default Home;