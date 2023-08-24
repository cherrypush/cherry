import { Grid } from '@mui/material'
import { Card, Sidebar } from 'flowbite-react'
import useCurrentUser from '../hooks/useCurrentUser'

const DocsPage = () => {
  const { user } = useCurrentUser()

  return (
    <div className="container">
      <h1>Docs</h1>
      <Card>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <div className="border rounded mb-6 md:border-none md:h-screen md:sticky md:top-0">
              <Sidebar className="w-full">
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="#installation">Initial setup ⚡️</Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="#commands">CLI commands 😌</Sidebar.Item>
                  <Sidebar.Item href="#cherry-run" className="text-sm ml-3">
                    · cherry run
                  </Sidebar.Item>
                  <Sidebar.Item href="#cherry-push" className="text-sm ml-3">
                    · cherry push
                  </Sidebar.Item>
                  <Sidebar.Item href="#cherry-backfill" className="text-sm ml-3">
                    · cherry backfill
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="#integrations">Integrations 🧩</Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="#demo">Live demo 🔴</Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar>
            </div>
          </Grid>

          <Grid item xs={12} md={8}>
            <div className="prose dark:prose-invert w-full max-w-full py-4 pr-3">
              <h1 id="installation">Initial setup ⚡️</h1>
              <p>Install the CLI globally with:</p>
              <pre>npm install -g cherrypush</pre>
              <p>Inside the root of your project, initialize your cherry configuration:</p>
              <pre>cherry init</pre>
              <p>Add your API key into a .env file at the root of your project:</p>
              <pre>
                CHERRY_API_KEY=
                {user ? (
                  user.api_key
                ) : (
                  <a className="text-white" href="/user/settings">
                    find-your-api-key-here
                  </a>
                )}
              </pre>
              {user && <p>🚨 This issyour real API key. Keep it safe.</p>}

              <hr />
              <h1 id="commands">CLI commands 😌</h1>
              <h2 id="cherry-run">cherry run</h2>
              <p>The run command accepts a couple of different options:</p>
              <pre>{`cherry run [--metric=<metric>] [--owner=<owners>]`}</pre>
              <p>When used without options, it logs ALL metric stats for your project:</p>
              <pre>
                {`$ cherry run
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│  todo   │   16   │
│  fixme  │   12   │
│ rubocop │    1   │
│ eslint  │   13   │
└─────────┴────────┘`}
              </pre>
              <p>To filter metrics, you can combine the different options such as:</p>
              <pre>{`cherry run --metric="Skipped tests"`}</pre>
              <pre>{`cherry run --owner=@fwuensche,@rchoquet`}</pre>
              <pre>{`cherry run --metric="Skipped tests" --owner=@fwuensche,@rchoquet`}</pre>
              <h2 id="cherry-push">cherry push</h2>
              <p>{`Your most used command. It submits current project stats to cherrypush.com:`}</p>

              <pre>{`$ cherry push
Uploading 42 occurrences...
Response: { status: 'ok' }
Your dashboard is available at https://www.cherrypush.com/user/projects
`}</pre>
              <h2 id="cherry-backfill">cherry backfill</h2>
              <p>Totally optional. This will submit your historic data to cherrypush.com:</p>
              <pre>{`cherry backfill [--since=<date>] [--until=<date>] [--interval=<days>]`}</pre>
              <ul>
                <li>
                  <b>--since</b> will default to a month ago
                </li>
                <li>
                  <b>--until</b> will default to today
                </li>
                <li>
                  <b>--interval</b> will default to 1 day
                </li>
              </ul>
              <p>Use the options to customize the dates you want to generate reports for:</p>
              <pre>cherry backfill --since=2023-01-01 --until=2022-01-07</pre>
              <p>If the range is too wide, increase your interval to save time:</p>
              <pre>cherry backfill --since=2023-01-01 --until=2023-12-01 --interval=30</pre>

              <hr />
              <h1 id="integrations">Integrations 🧩</h1>
              <h2>GitHub Actions</h2>
              <p>You can easily automate Cherry to submit reports on every commit to master.</p>
              <pre>{`# .github/workflows/cherry_push.yml

name: Cherry push

on:
  push:
    branches:
      - master

jobs:
  cherry:
    name: runner / cherry
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Install cherry
        run: npm i -g cherrypush
      - name: Push metrics
        run: cherry push --api-key=\${{ secrets.CHERRY_API_KEY }}`}</pre>

              <hr />
              <h1 id="demo">Live demo 🔴</h1>
              <p>
                We've created a sample project so you can try a <a href="https://www.cherrypush.com/demo">live demo</a>{' '}
                of Cherry.
              </p>
              <p>
                Found a bug? Report directly to me via <a href="https://twitter.com/@fwuensche">Twitter</a> or{' '}
                <a href="mailto:flavio@cherrypush.com">email</a>.
              </p>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default DocsPage
