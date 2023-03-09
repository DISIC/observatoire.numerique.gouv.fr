import Head from 'next/head';

export default function Home({ data }: { data: any[] }) {
  console.log(data);

  const structure = Object.keys(data[0].fields);
  console.log(structure);

  return (
    <>
      <Head>
        <title>Observatoire du numérique</title>
        <meta
          name="description"
          content="L’Observatoire de la qualité des démarches en ligne : pour des services publics numériques de qualité."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Tests AirTable</h1>
        <div
          style={{
            overflowX: 'scroll',
            maxWidth: '90vw',
            maxHeight: '70vh',
            marginTop: '40px'
          }}
        >
          <table style={{ backgroundColor: '#d9dedf' }} border={1}>
            <thead
              style={{ position: 'sticky', top: 0, backgroundColor: '#fff' }}
            >
              {structure.map(s => (
                <th
                  style={{
                    minWidth: '200px'
                  }}
                  key={s}
                >
                  {s}
                </th>
              ))}
            </thead>
            <tbody>
              {data.map((row: any) => (
                <tr key={row.id}>
                  {structure.map(s => (
                    <td
                      style={{
                        minWidth: '200px'
                      }}
                      key={row.id + s}
                    >
                      {typeof row.fields[s] === 'string' ? row.fields[s] : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:3000/api/airtable/demarches`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}
