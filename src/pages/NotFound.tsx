import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 20 }}
    >
      <div>
        <div style={{
          fontSize: 96, fontWeight: 500, lineHeight: 1,
          letterSpacing: '-0.03em', color: 'var(--text-3)',
        }}>404</div>
        <h2 className="h2" style={{ marginTop: 20 }}>Page not found</h2>
        <p className="mute" style={{ marginTop: 10 }}>That route doesn't exist in Versiti.</p>
        <div style={{ marginTop: 24 }}>
          <Button onClick={() => navigate('/')} icon={<Home size={16} />}>Back to landing</Button>
        </div>
      </div>
    </motion.div>
  );
}
