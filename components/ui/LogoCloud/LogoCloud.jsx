export default function LogoCloud() {
   return (
          <div>
            <p className="mt-24 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">
              Brought to you by
            </p>
            <div className="grid grid-cols-1 place-items-center	my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
              <div className="flex items-center justify-start h-12">
                <a href="https://nextjs.org" aria-label="Next.js Link">
                  <img
                    src="/nextjs.svg"
                    alt="Next.js Logo"
                    className="h-6 sm:h-12 text-white ml-16"
                  />
                </a>
              </div>
              <div className="flex items-center justify-start h-12">
                <a href="https://vercel.com" aria-label="Vercel.com Link">
                  <img
                    src="/vercel.svg"
                    alt="Vercel.com Logo"
                    className="h-6 text-white ml-40"
                  />
                </a>
              </div>
              
              <div className="flex items-center justify-start h-12">
                <a href="https://github.com" aria-label="github.com Link">
                  <img
                    src="/github.svg"
                    alt="github.com Logo"
                    className="h-8 text-white ml-80"
                  />
                </a>
              </div>
            </div>
          </div>
        ); 
}




         // return (
  //   <div>
  //     <p className="mt-24 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">
  //       Brought to you by
  //     </p>
  //     <div className="grid grid-cols-1 place-items-center	my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
  //       <div className="flex items-center justify-start h-12">
  //         <a href="https://nextjs.org" aria-label="Next.js Link">
  //           <img
  //             src="/nextjs.svg"
  //             alt="Next.js Logo"
  //             className="h-6 sm:h-12 text-white "
  //           />
  //         </a>
  //       </div>
  //       <div className="flex items-center justify-start h-12">
  //         <a href="https://stripe.com" aria-label="razorpay.com Link">
  //           <img
  //             src="/razorpay.svg"
  //             alt="razorpay.com Logo"
  //             className="h-12 text-white"
  //           />
  //         </a>
  //       </div>
  //       <div className="flex items-center justify-start h-12">
  //         <a href="https://cloud.mongodb.com" aria-label="mongoDB Link">
  //           <img
  //             src="/mongoDB.svg"
  //             alt="mongoDB Logo"
  //             className="h-10 text-white"
  //           />
  //         </a>
  //       </div>
  //       <div className="flex items-center justify-start h-12">
  //         <a href="https://vercel.com" aria-label="Vercel.com Link">
  //           <img
  //             src="/vercel.svg"
  //             alt="Vercel.com Logo"
  //             className="h-6 text-white"
  //           />
  //         </a>
  //       </div>
        
  //       <div className="flex items-center justify-start h-12">
  //         <a href="https://github.com" aria-label="github.com Link">
  //           <img
  //             src="/github.svg"
  //             alt="github.com Logo"
  //             className="h-8 text-white"
  //           />
  //         </a>
  //       </div>
  //     </div>
  //   </div>
  // );