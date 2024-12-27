import Link from "next/link";

const NoteFound = () => {
    return (
             <div>
              <h1>Page Not Found</h1>
              <p>The page you are looking for that is not exist</p>
              <Link href='/'>Return Home</Link>
             </div>
    )
  };
  
  export default NoteFound;