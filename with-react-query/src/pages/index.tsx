import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState,useMemo} from 'react'
import { useQuery } from 'react-query'



interface Pokemon{
  id:number;
  name:string;
  image:string
}

const getPokemon = (): Promise<Pokemon[]> => {
  fetch("https://jherr-pokemon.s3.us-west-1.amazonaws.com/index.json")
  .then((res) => res.json())
}

export async function  getServerSideProps(){
  return{
    props:{
      initialPokemon:await getPokemon(),
    },
  }
}

export default function Home({initialPokemon}:{initialPokemon:Pokemon[]}) {

  const {data:pokemon} = useQuery("pokemon",getPokemon,{
    initialData:initialPokemon,
  });

  const [filter,setFilter] = useState("");

  const filteredPokemon = useMemo(
    () => 
      initialPokemon.filter((p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()) 
      ),
    [filter,pokemon]
  )

  return (
    <>
      <div className={styles.main}>
        <Head>
          <title>Pokemon</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico'/>
        </Head>
        <div>
          <input className={styles.search}
           type='text'
           value={filter}
           onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className={styles.container}>
          {filteredPokemon.slice(0,20).map((p) => (
            <div key={p.id} className={styles.image} >
              <img
                alt={p.name}
                src={`https://jherr-pokemon.s3.us-west-1.amazonaws.com/${p.image}`} 
               />
               <h2>{p.name}</h2>
            </div>
          ))};
        </div>
      </div>
    </>
  )
}
