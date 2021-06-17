import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { Menu as MenuIcon, Close as CloseIcon } from '@material-ui/icons'
import { echoHost } from 'utils/Hosts'
import Div100vh from 'react-div-100vh'
import axios from 'axios'
import TorrentList from 'components/TorrentList'
import DonateSnackbar from 'components/Donate'
import DonateDialog from 'components/Donate/DonateDialog'
import useChangeLanguage from 'utils/useChangeLanguage'

import { AppWrapper, AppHeader, LanguageSwitch } from './style'
import Sidebar from './Sidebar'

const baseTheme = createMuiTheme({
  palette: { primary: { main: '#00a572' }, secondary: { main: '#ffa724' }, tonalOffset: 0.2 },
  typography: { fontFamily: 'Open Sans, sans-serif' },
})

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false)
  const [torrServerVersion, setTorrServerVersion] = useState('')
  const [currentLang, changeLang] = useChangeLanguage()

  useEffect(() => {
    axios.get(echoHost()).then(({ data }) => setTorrServerVersion(data))
  }, [])

  return (
    <MuiThemeProvider theme={baseTheme}>
      <CssBaseline />

      {/* Div100vh - iOS WebKit fix  */}
      <Div100vh>
        <AppWrapper>
          <AppHeader>
            <IconButton
              style={{ marginRight: '20px' }}
              color='inherit'
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              edge='start'
            >
              {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            <Typography variant='h6' noWrap>
              TorrServer {torrServerVersion}
            </Typography>

            <div style={{ justifySelf: 'end' }}>
              <LanguageSwitch onClick={() => (currentLang === 'en' ? changeLang('ru') : changeLang('en'))}>
                {currentLang === 'en' ? 'RU' : 'EN'}
              </LanguageSwitch>
            </div>
          </AppHeader>

          <Sidebar isDrawerOpen={isDrawerOpen} setIsDonationDialogOpen={setIsDonationDialogOpen} />

          <TorrentList />

          {isDonationDialogOpen && <DonateDialog onClose={() => setIsDonationDialogOpen(false)} />}
          {!JSON.parse(localStorage.getItem('snackbarIsClosed')) && <DonateSnackbar />}
        </AppWrapper>
      </Div100vh>
    </MuiThemeProvider>
  )
}