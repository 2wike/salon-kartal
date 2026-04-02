import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Hakkimizda from './pages/Hakkimizda';
import Ustalarimiz from './pages/Ustalarimiz';
import Urunler from './pages/Urunler';
import Giris from './pages/Giris';
import Kayit from './pages/Kayit';
import Admin from './pages/Admin';
import Profil from './pages/Profil';

const noFooterRoutes = ['/giris', '/kayit', '/admin'];

function Layout({ children }) {
  const path = window.location.pathname;
  const hideFooter = noFooterRoutes.some(r => path.startsWith(r));
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hakkimizda" element={<Hakkimizda />} />
            <Route path="/ustalarimiz" element={<Ustalarimiz />} />
            <Route path="/urunler" element={<Urunler />} />
            <Route path="/giris" element={<Giris />} />
            <Route path="/kayit" element={<Kayit />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profil" element={<Profil />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
