import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, Heart, Gift, Check, ArrowRight, Copy, 
  CheckCircle2, AlertCircle, ChevronRight, PartyPopper, Settings, Lock, X, Save, Upload,
  Users, Utensils, Coffee, Clock, Wallet, TrendingUp
} from 'lucide-react';
import { saveRSVP, saveDonation, getGifts, syncAllData } from './services/api';

// --- BASE DE DADOS DAS FAMÍLIAS ---
const FAMILIAS_DB = [
  { id: 1, codigo: "SOL001", familia: "Família 1", membros: [{nome: "Dani", crianca: false}, {nome: "Jhonatas", crianca: false}, {nome: "Graça", crianca: false}, {nome: "Kelly", crianca: false}, {nome: "Dayvid", crianca: false}, {nome: "Miguel", crianca: false}, {nome: "Lucas", crianca: false}, {nome: "Marcia", crianca: false}] },
  { id: 2, codigo: "SOL002", familia: "Família 2", membros: [{nome: "Cleide", crianca: false}, {nome: "Gino", crianca: false}, {nome: "Keyla", crianca: false}, {nome: "Arthur", crianca: false}] },
  { id: 3, codigo: "SOL003", familia: "Família 3", membros: [{nome: "Arthur Erica", crianca: false}, {nome: "Erica", crianca: false}, {nome: "Irmã de Arthur", crianca: true}] },
  { id: 4, codigo: "SOL004", familia: "Família 4", membros: [{nome: "Wesley", crianca: false}, {nome: "Fernanda", crianca: false}, {nome: "Zé", crianca: true}] },
  { id: 5, codigo: "SOL005", familia: "Família 5", membros: [{nome: "Yasmin", crianca: false}, {nome: "Ivanildo", crianca: false}, {nome: "Marluce", crianca: false}] },
  { id: 6, codigo: "SOL006", familia: "Família 6", membros: [{nome: "Dada", crianca: false}, {nome: "Luciano", crianca: false}, {nome: "Ton", crianca: true}, {nome: "Adriel", crianca: true}] },
  { id: 7, codigo: "SOL007", familia: "Família 7", membros: [{nome: "Lourdes", crianca: false}] },
  { id: 8, codigo: "SOL008", familia: "Família 8", membros: [{nome: "Ceia", crianca: false}] },
  { id: 9, codigo: "SOL009", familia: "Família 9", membros: [{nome: "Jandira", crianca: false}] },
  { id: 10, codigo: "SOL010", familia: "Família 10", membros: [{nome: "Tio Toin", crianca: false}, {nome: "Jaqueline", crianca: false}, {nome: "Pedrinho", crianca: true}] },
  { id: 11, codigo: "SOL011", familia: "Família 11", membros: [{nome: "Grazi", crianca: false}, {nome: "Vini", crianca: false}] },
  { id: 12, codigo: "SOL012", familia: "Família 12", membros: [{nome: "Kelly", crianca: false}, {nome: "João", crianca: false}] },
  { id: 13, codigo: "SOL013", familia: "Família 13", membros: [{nome: "Bio pai de dani", crianca: false}, {nome: "Esposa de pai de dani", crianca: false}] },
  { id: 14, codigo: "SOL014", familia: "Família 14", membros: [{nome: "Andrea", crianca: false}] },
  { id: 15, codigo: "SOL015", familia: "Família 15", membros: [{nome: "Marcos", crianca: false}, {nome: "Raylla", crianca: false}, {nome: "Mel", crianca: true}] },
  { id: 16, codigo: "SOL016", familia: "Família 16", membros: [{nome: "Aline", crianca: false}, {nome: "Luan", crianca: false}, {nome: "Sobrinho 1", crianca: true}, {nome: "Sobrinho 2", crianca: true}] },
  { id: 17, codigo: "SOL017", familia: "Família 17", membros: [{nome: "Filipe", crianca: false}, {nome: "Mari", crianca: false}] },
  { id: 18, codigo: "SOL018", familia: "Família 18", membros: [{nome: "Rebeca", crianca: false}, {nome: "Helena", crianca: true}] },
  { id: 19, codigo: "SOL019", familia: "Família 19", membros: [{nome: "Vovó", crianca: false}, {nome: "Vovo Carlos", crianca: false}] },
  { id: 20, codigo: "SOL020", familia: "Família 20", membros: [{nome: "Cinthia", crianca: false}, {nome: "Joyce", crianca: false}, {nome: "Lucas", crianca: false}] },
  { id: 21, codigo: "SOL021", familia: "Família 21", membros: [{nome: "Israel", crianca: false}, {nome: "Sofia", crianca: false}, {nome: "Olivia", crianca: false}, {nome: "João", crianca: true}] },
  { id: 22, codigo: "SOL022", familia: "Família 22", membros: [{nome: "Saulo", crianca: false}, {nome: "Fran", crianca: false}, {nome: "Ana Clara", crianca: false}, {nome: "Valentina", crianca: false}] },
  { id: 23, codigo: "SOL023", familia: "Família 23", membros: [{nome: "Fran", crianca: false}, {nome: "Nelson", crianca: false}, {nome: "Valentina", crianca: true}] },
  { id: 24, codigo: "SOL024", familia: "Família 24", membros: [{nome: "Marcio", crianca: false}, {nome: "Valéria", crianca: false}, {nome: "Valentin", crianca: true}] },
  { id: 25, codigo: "SOL025", familia: "Família 25", membros: [{nome: "Assis", crianca: false}, {nome: "Filha Assis", crianca: false}] },
];

// --- FOTOS DO NATHAN ---
const NATHAN_PHOTOS = [
  '/Nathan_Playground.png',
  '/Nathan_no_carro.png',
  '/Nathan_Carrinho_de_controle_remoto.png',
  '/Nathan_brincando_monsetori.png',
  '/nathan_imagem_de_fundo.png',
  '/Nathan_feliz_após_o_pix.jpeg'
];

const DEFAULT_BG_IMAGE = '/nathan_imagem_de_fundo.png';
const DEFAULT_THANKYOU_IMAGE = '/Nathan_feliz_após_o_pix.jpeg';

const INITIAL_GIFTS = [
  { id: 1, name: "Carro Elétrico Infantil", target: 1200, current: 850, image: "/Nathan_no_carro.png", color: "bg-blue-400" },
  { id: 2, name: "Mini Playground Infantil", target: 1500, current: 1500, image: "/Nathan_Playground.png", color: "bg-green-400" }, 
  { id: 3, name: "Carro Controle Remoto", target: 800, current: 300, image: "/Nathan_Carrinho_de_controle_remoto.png", color: "bg-yellow-400" },
  { id: 4, name: "Kit Educativo Montessori", target: 600, current: 450, image: "/Nathan_brincando_monsetori.png", color: "bg-orange-400" }
];

const FOOD_OPTIONS = [
  "Cachorro quente", "Mini pizza", "Batata frita", "Coxinha", 
  "Bolinho de Camarão", "Bolinho de Charque", "Bolinho de Queijo", 
  "Pastel Carne", "Pastel Queijo", "Canudinho carne", "Canudinho Soja", 
  "Empada de frango", "Empada de soja"
];

const DRINK_OPTIONS = [
  "Guaraná Antártica", "Coca Cola", "Fanta Laranja", "Fanta Uva", 
  "Pepsi Cola", "Cajuína São Geraldo", "Soda Limonada", "Suco de Cajá", "Suco de Acerola"
];

export default function App() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [family, setFamily] = useState(null);
  
  const [bgImage, setBgImage] = useState(() => localStorage.getItem('NATHAN_BG_DB') || DEFAULT_BG_IMAGE);
  const [thankYouImg, setThankYouImg] = useState(() => localStorage.getItem('NATHAN_THANKYOU_DB') || DEFAULT_THANKYOU_IMAGE);

  const [isAttending, setIsAttending] = useState(true);
  const [confirmedMembers, setConfirmedMembers] = useState({});
  const [preferences, setPreferences] = useState({ foods: [], drinks: [], restricao: '' });
  
  const [gifts, setGifts] = useState(() => {
    const saved = localStorage.getItem('NATHAN_GIFTS_DB');
    let loadedGifts = saved ? JSON.parse(saved) : INITIAL_GIFTS;
    
    // Migrar imagens antigas (SVG) para fotos do Nathan
    const imageMap = {
      0: '/Nathan_no_carro.png',
      1: '/Nathan_Playground.png',
      2: '/Nathan_Carrinho_de_controle_remoto.png',
      3: '/Nathan_brincando_monsetori.png'
    };
    
    loadedGifts = loadedGifts.map((gift, idx) => {
      if (gift.image && gift.image.startsWith('data:image/svg')) {
        return { ...gift, image: imageMap[idx] || gift.image };
      }
      return gift;
    });
    
    return loadedGifts;
  });
  
  const [selectedGift, setSelectedGift] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [pixCopied, setPixCopied] = useState(false);
  
  const [showThankYou, setShowThankYou] = useState(false);
  const [lastDonationAmount, setLastDonationAmount] = useState('');

  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminTab, setAdminTab] = useState('config'); 
  const [editBg, setEditBg] = useState(bgImage);
  const [editThankYouImg, setEditThankYouImg] = useState(thankYouImg);
  const [editGifts, setEditGifts] = useState(gifts);
  const [presencasDB, setPresencasDB] = useState({}); 

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, [step]);

  // Sincronização com Google Sheets em tempo real
  useEffect(() => {
    const syncGifts = async () => {
      try {
        const onlineGifts = await getGifts();
        if (onlineGifts && onlineGifts.length > 0) {
          // Mescla dados locais com dados da planilha (prioriza valores arrecadados da planilha)
          const merged = gifts.map(localGift => {
            const cloudGift = onlineGifts.find(g => g.id === localGift.id);
            if (cloudGift) {
              return {
                ...localGift,
                current: cloudGift.current, // Atualiza arrecadação da planilha
                target: cloudGift.target || localGift.target
              };
            }
            return localGift;
          });
          setGifts(merged);
        }
      } catch (error) {
        console.warn('Não foi possível sincronizar gifts da planilha:', error);
        // Continua usando dados locais se a planilha não estiver disponível
      }
    };

    // Sincroniza ao montar o componente
    syncGifts();

    // Sincroniza a cada 30 segundos
    const interval = setInterval(syncGifts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sincronização localStorage
  useEffect(() => {
    localStorage.setItem('NATHAN_GIFTS_DB', JSON.stringify(gifts));
  }, [gifts]);

  // Carregar presenças do localStorage quando abrir admin
  useEffect(() => {
    if (showAdmin && adminAuth) {
      const presencas = {};
      FAMILIAS_DB.forEach(familia => {
        const saved = localStorage.getItem(`NATHAN_PRESENCA_${familia.codigo}`);
        if (saved) {
          presencas[familia.codigo] = JSON.parse(saved);
        }
      });
      setPresencasDB(presencas);
    }
  }, [showAdmin, adminAuth]);

  // Recarregar presenças quando mudar para aba de dashboard
  useEffect(() => {
    if (adminTab === 'dashboard' && adminAuth) {
      const presencas = {};
      FAMILIAS_DB.forEach(familia => {
        const saved = localStorage.getItem(`NATHAN_PRESENCA_${familia.codigo}`);
        if (saved) {
          presencas[familia.codigo] = JSON.parse(saved);
        }
      });
      setPresencasDB(presencas);
    }
  }, [adminTab, adminAuth]);

  const dashboardStats = useMemo(() => {
    let totalConfirmed = 0;
    let totalAbsent = 0;
    let totalPeople = 0;
    let foodCounts = {};
    let drinkCounts = {};
    let restricoes = [];

    Object.values(presencasDB).forEach(pres => {
      if (pres.status === 'presente') {
        totalConfirmed++;
        totalPeople += (pres.membros_confirmados?.length || 0);
        
        if (pres.preferencias) {
          pres.preferencias.foods?.forEach(f => {
            foodCounts[f] = (foodCounts[f] || 0) + 1;
          });
          pres.preferencias.drinks?.forEach(d => {
            drinkCounts[d] = (drinkCounts[d] || 0) + 1;
          });
          if (pres.preferencias.restricao && pres.preferencias.restricao.trim() !== '') {
            restricoes.push(`${pres.familia}: ${pres.preferencias.restricao}`);
          }
        }
      } else if (pres.status === 'ausente') {
        totalAbsent++;
      }
    });

    const totalPending = FAMILIAS_DB.length - totalConfirmed - totalAbsent;
    const sortedFoods = Object.entries(foodCounts).sort((a, b) => b[1] - a[1]);
    const sortedDrinks = Object.entries(drinkCounts).sort((a, b) => b[1] - a[1]);

    return { totalConfirmed, totalAbsent, totalPending, totalPeople, sortedFoods, sortedDrinks, restricoes };
  }, [presencasDB]);

  const compressImage = (file, maxWidth, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        callback(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  };

  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 1200, (compressedBase64) => {
        setEditBg(compressedBase64);
      });
    }
  };

  const handleThankYouUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 800, (compressedBase64) => {
        setEditThankYouImg(compressedBase64);
      });
    }
  };

  const handleGiftEdit = (index, field, value) => {
    const updated = [...editGifts];
    updated[index] = { ...updated[index], [field]: (field === 'target' || field === 'current') ? Number(value) : value };
    setEditGifts(updated);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'mjck13WY') {
      setAdminAuth(true);
      setAdminPass('');
    } else {
      alert('Senha incorreta!');
    }
  };

  const saveAdminData = async () => {
    setBgImage(editBg);
    setThankYouImg(editThankYouImg);
    setGifts(editGifts);
    localStorage.setItem('NATHAN_BG_DB', editBg);
    localStorage.setItem('NATHAN_THANKYOU_DB', editThankYouImg);
    localStorage.setItem('NATHAN_GIFTS_DB', JSON.stringify(editGifts));
    alert('Configurações salvas! 🎉');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const upperCode = code.trim().toUpperCase();
    const found = FAMILIAS_DB.find(f => f.codigo === upperCode);
    
    if (found) {
      setFamily(found);
      const initialConfirmations = {};
      found.membros.forEach(m => { initialConfirmations[m.nome] = false; });
      setConfirmedMembers(initialConfirmations);
      setIsAttending(true);
      setError('');
      changeStep(3);
    } else {
      setError('Código não encontrado. Verifique seu convite 💛');
    }
  };

  const toggleMember = (nome) => {
    setConfirmedMembers(prev => ({ ...prev, [nome]: !prev[nome] }));
  };

  const togglePreference = (type, item) => {
    setPreferences(prev => {
      const currentList = prev[type] || [];
      if (currentList.includes(item)) {
        return { ...prev, [type]: currentList.filter(i => i !== item) };
      } else {
        return { ...prev, [type]: [...currentList, item] };
      }
    });
  };

  const handleConfirmPresence = async () => {
    const convidadosConfirmados = Object.keys(confirmedMembers).filter(nome => confirmedMembers[nome]);
    const presencaData = {
      familia: family.familia,
      status: isAttending ? 'presente' : 'ausente',
      membros_confirmados: isAttending ? convidadosConfirmados : [],
      preferencias: isAttending ? preferences : null,
      data_confirmacao: new Date().toISOString()
    };
    
    // Salva localmente
    localStorage.setItem(`NATHAN_PRESENCA_${family.codigo}`, JSON.stringify(presencaData));
    
    // Salva na planilha do Google
    try {
      await saveRSVP({
        codigo: family.codigo,
        familia: family.familia,
        status: isAttending ? 'sim' : 'nao',
        membros_confirmados: isAttending ? convidadosConfirmados : [],
        preferencias: isAttending ? { ...preferences } : {}
      });
      console.log('RSVP salvo na planilha com sucesso!');
    } catch (error) {
      console.warn('Erro ao salvar RSVP na planilha:', error);
      // Continua mesmo se falhar, já que salvou localmente
    }
    
    // Atualizar presencasDB em tempo real
    setPresencasDB(prev => ({
      ...prev,
      [family.codigo]: presencaData
    }));
    
    changeStep(4);
  };

  const handleContribute = (gift) => {
    setSelectedGift(gift);
    setDonationAmount('');
    setPixCopied(false);
  };

  const processDonation = async () => {
    if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) return;
    
    const numAmount = Number(donationAmount);
    
    const updatedGifts = gifts.map(g => {
      if (g.id === selectedGift.id) {
        return { ...g, current: Math.min(g.target, g.current + numAmount) };
      }
      return g;
    });

    setGifts(updatedGifts);
    setLastDonationAmount(donationAmount);
    
    // Salva doação na planilha
    try {
      const donationResult = await saveDonation({
        codigo: family?.codigo || '',
        familia: family?.familia || 'Anônimo',
        giftId: selectedGift.id,
        giftName: selectedGift.name,
        amount: numAmount,
        metodo: 'PIX',
        comprovanteUrl: '',
        observacoes: ''
      });
      console.log('Doação salva na planilha com sucesso!', donationResult);
      
      // Atualiza o valor arrecadado do gift se retornou newCurrent
      if (donationResult.ok && donationResult.newCurrent) {
        const updatedGifts = gifts.map(g => {
          if (g.id === selectedGift.id) {
            return { ...g, current: donationResult.newCurrent };
          }
          return g;
        });
        setGifts(updatedGifts);
      }
    } catch (error) {
      console.warn('Erro ao salvar doação na planilha:', error);
      // Continua mesmo se falhar, já que salvou localmente
    }
    
    setSelectedGift(null);
    setShowThankYou(true);
  };

  const copyPix = () => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = "81997083244";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const changeStep = (newStep) => {
    setIsVisible(false);
    setTimeout(() => {
      setStep(newStep);
      setIsVisible(true);
    }, 300);
  };

  // RENDERIZAÇÃO DOS PASSOS
  
  const renderStep1Welcome = () => (
    <div className={`flex flex-col items-center justify-center text-center space-y-8 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-40 animate-pulse"></div>
        <Sun className="w-32 h-32 text-yellow-400 relative z-10 animate-spin-slow" strokeWidth={1.5} />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif text-slate-800 leading-tight">
          Nosso <span className="text-yellow-500 font-bold">Solzinho</span> vai completar seu 1º aninho
        </h1>
        <p className="text-lg text-slate-600 font-light max-w-md mx-auto">
          A festa será ainda mais iluminada com a sua presença. Venha celebrar a vida do Nathan!
        </p>
      </div>

      <button 
        onClick={() => changeStep(2)}
        className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          Confirmar Presença
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </button>

      <div className="text-sm text-slate-400 flex items-center gap-1">
        <Heart className="w-4 h-4 text-red-300" fill="currentColor" />
        <span>Para convidados especiais</span>
      </div>
    </div>
  );

  const renderStep2Login = () => (
    <div className={`flex flex-col items-center justify-center space-y-8 w-full max-w-md mx-auto transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full border border-yellow-50">
        <div className="flex justify-center mb-6">
          <Sun className="w-12 h-12 text-yellow-400" strokeWidth={2} />
        </div>
        
        <h2 className="text-2xl font-serif text-center text-slate-800 mb-2">Acesso Restrito</h2>
        <p className="text-center text-slate-500 text-sm mb-8">Digite o código presente no seu convite.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <div className="relative">
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: SOL001"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all uppercase text-center font-medium tracking-widest text-slate-700"
              />
            </div>
            {error && (
              <div className="mt-3 flex items-center justify-center gap-2 text-orange-500 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-slate-800 text-white rounded-xl font-medium shadow-md hover:bg-slate-700 transition-colors flex justify-center items-center gap-2"
          >
            Acessar Convite
          </button>
        </form>
      </div>
    </div>
  );

  const renderStep3Confirm = () => (
    <div className={`w-full max-w-lg mx-auto transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-yellow-100 to-orange-50 p-6 text-center border-b border-yellow-200">
          <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Convite destinado a</p>
          <h2 className="text-3xl font-serif text-slate-800">{family?.familia}</h2>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl">
            <button 
              onClick={() => setIsAttending(true)} 
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${isAttending ? 'bg-white shadow-md text-slate-800 scale-100' : 'text-slate-500 scale-95 hover:text-slate-700'}`}
            >
              🎉 Sim, nós vamos!
            </button>
            <button 
              onClick={() => setIsAttending(false)} 
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${!isAttending ? 'bg-white shadow-md text-slate-800 scale-100' : 'text-slate-500 scale-95 hover:text-slate-700'}`}
            >
              🥺 Não poderei ir
            </button>
          </div>

          {isAttending ? (
            <>
              <div className="animate-fade-in">
                <p className="text-slate-600 mb-4 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Quem estará presente?
                </p>
                <div className="space-y-3">
                  {family?.membros.map((membro, idx) => (
                    <label 
                      key={idx} 
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border ${confirmedMembers[membro.nome] ? 'bg-yellow-50 border-yellow-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="sr-only"
                          checked={confirmedMembers[membro.nome] || false}
                          onChange={() => toggleMember(membro.nome)}
                        />
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${confirmedMembers[membro.nome] ? 'bg-yellow-400 border-yellow-400' : 'bg-white border-slate-300'}`}>
                          {confirmedMembers[membro.nome] && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <span className={`ml-4 font-medium ${confirmedMembers[membro.nome] ? 'text-slate-800' : 'text-slate-600'}`}>
                        {membro.nome}
                      </span>
                      {membro.crianca && (
                        <span className="ml-auto text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          Criança
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-5 animate-fade-in">
                <h3 className="font-medium text-slate-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  O que vocês mais gostam? (Opcional)
                </h3>
                <p className="text-sm text-slate-500">
                  Marque suas preferências para nos ajudar com o cardápio! (Ah, os doces já estão garantidos para todo mundo 🍬)
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Comidinhas & Salgados</label>
                    <div className="flex flex-wrap gap-2">
                      {FOOD_OPTIONS.map(food => (
                        <button
                          key={food}
                          type="button"
                          onClick={() => togglePreference('foods', food)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${preferences.foods.includes(food) ? 'bg-yellow-400 border-yellow-400 text-slate-900 shadow-md scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-yellow-300 hover:bg-white'}`}
                        >
                          {food}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Bebidas</label>
                    <div className="flex flex-wrap gap-2">
                      {DRINK_OPTIONS.map(drink => (
                        <button
                          key={drink}
                          type="button"
                          onClick={() => togglePreference('drinks', drink)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${preferences.drinks.includes(drink) ? 'bg-blue-400 border-blue-400 text-white shadow-md scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-white'}`}
                        >
                          {drink}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Alguém possui restrição alimentar?</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Alergia a amendoim, intolerância à lactose..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      value={preferences.restricao}
                      onChange={(e) => setPreferences({...preferences, restricao: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-10 text-center animate-fade-in">
              <div className="inline-flex items-center justify-center p-4 bg-slate-50 rounded-full mb-4">
                <Heart className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-serif text-slate-800 mb-2">Poxa, que pena!</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Sentiremos muito a sua falta na nossa festa. Mas agradecemos imensamente por nos avisar! 💛
              </p>
            </div>
          )}

          <button 
            onClick={handleConfirmPresence}
            disabled={isAttending && !Object.values(confirmedMembers).some(Boolean)}
            className={`w-full py-4 rounded-xl font-medium shadow-md transition-all flex justify-center items-center gap-2 ${
              (!isAttending || Object.values(confirmedMembers).some(Boolean))
                ? 'bg-slate-800 text-white hover:bg-slate-700 hover:shadow-lg' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isAttending ? 'Confirmar e Continuar' : 'Avisar Ausência e Continuar'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4Gifts = () => (
    <div className={`fixed inset-0 w-full h-full overflow-y-auto transition-opacity duration-1000 section-dreams animate-fade-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative z-10 min-h-full flex flex-col items-center py-10 px-4 md:px-8">
        
        <div className="w-full max-w-4xl mx-auto mt-32 md:mt-48">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)] tracking-wide">
              {isAttending ? 'Presença Confirmada!' : 'Agradecemos o aviso!'}
            </h2>
            <p className="text-lg text-slate-100 font-medium max-w-lg mx-auto bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg leading-relaxed">
              {isAttending 
                ? 'Sua presença é o nosso maior presente! O Nathan vai ficar muito feliz.' 
                : 'Sentiremos muito a sua falta na festa! Mas o carinho sempre chega de longe.'}
            </p>
          </div>

          <div className="glass-card-premium p-6 md:p-12 relative z-10 mb-12">
            <div className="text-center mb-12 space-y-4">
              <h3 className="text-3xl md:text-4xl font-serif text-white drop-shadow-md">Lista de Sonhos do Nathan ☀️</h3>
              <p className="text-base md:text-lg text-slate-200 max-w-xl mx-auto font-light">
                {isAttending 
                  ? 'Se desejar presentear de forma diferente, você pode nos ajudar a realizar a comprar dos grandes sonhos do nosso Solzinho.'
                  : 'Caso ainda deseje presentear de alguma forma, você pode participar da nossa vaquinha.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {gifts.map(gift => {
                const isCompleted = gift.current >= gift.target;
                const progress = Math.min(100, Math.round((gift.current / gift.target) * 100));

                return (
                  <div key={gift.id} className="toy-card-premium p-8 flex flex-col items-center text-center relative overflow-hidden group">
                    
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-green-500/90 text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg border border-green-400 backdrop-blur-md">
                          <CheckCircle2 className="w-4 h-4" />
                          Realizado!
                        </div>
                      </div>
                    )}
                    
                    <div className="relative mb-6">
                      <div className={`w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full p-1.5 ${isCompleted ? 'bg-gradient-to-tr from-green-400 to-green-600' : 'bg-gradient-to-tr from-white/40 to-white/10'} shadow-2xl transition-all duration-500 group-hover:scale-105`}>
                        <img 
                          src={gift.image} 
                          alt={gift.name} 
                          className="w-full h-full rounded-full object-cover border-4 border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex-1 w-full flex flex-col mt-4">
                      <h4 className="font-bold text-white leading-tight text-xl mb-2 drop-shadow-sm">{gift.name}</h4>
                      <p className="text-sm font-medium text-slate-300 mb-8">Meta: R$ {gift.target.toLocaleString('pt-BR')}</p>

                      <div className="space-y-3 relative z-0 mt-auto w-full">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-slate-200 drop-shadow-sm">Arrecadado: R$ {gift.current.toLocaleString('pt-BR')}</span>
                          <span className={isCompleted ? "text-green-400 drop-shadow-sm" : "text-yellow-300 drop-shadow-sm"}>{progress}%</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden shadow-inner border border-white/5">
                          <div 
                            className={`progress-bar ${isCompleted ? 'bg-green-500' : gift.color}`} 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleContribute(gift);
                          }}
                          disabled={isCompleted}
                          className={`mt-6 w-full py-4 rounded-xl font-bold transition-all duration-300 text-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)] ${
                            isCompleted 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30 cursor-not-allowed'
                              : 'bg-white/10 border border-white/30 text-white hover:bg-white hover:text-slate-900 hover:-translate-y-1'
                          }`}
                        >
                          {isCompleted ? 'Sonho Realizado 🎉' : 'Contribuir com PIX'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-[#FAFAFA] text-slate-800 relative overflow-hidden selection:bg-yellow-200">
      {/* Background Decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* MODAL DO PAINEL ADM */}
      {showAdmin && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-2 md:p-4 animate-fade-in pointer-events-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
            
            <div className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center z-10">
              <h2 className="text-xl font-serif text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-500" />
                Administração
              </h2>
              <button 
                onClick={() => setShowAdmin(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!adminAuth ? (
              <div className="p-6 flex-1 flex flex-col justify-center">
                <form onSubmit={handleAdminLogin} className="space-y-4 max-w-md mx-auto w-full">
                  <p className="text-sm text-slate-600 text-center mb-6">Digite a senha para acessar o painel.</p>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="password" 
                      value={adminPass}
                      onChange={e => setAdminPass(e.target.value)}
                      placeholder="Senha de acesso"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition">
                    Acessar Painel
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex px-4 pt-2 gap-2 bg-slate-50 border-b border-slate-200">
                  <button 
                    onClick={() => setAdminTab('config')}
                    className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${adminTab === 'config' ? 'border-yellow-400 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    Edição do Site
                  </button>
                  <button 
                    onClick={() => setAdminTab('dashboard')}
                    className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${adminTab === 'dashboard' ? 'border-blue-400 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    <Users className="w-4 h-4" />
                    Presenças
                  </button>
                  <button 
                    onClick={() => setAdminTab('financeiro')}
                    className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${adminTab === 'financeiro' ? 'border-green-400 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    <Wallet className="w-4 h-4" />
                    Financeiro
                  </button>
                </div>

                <div className="p-4 md:p-6 flex-1 overflow-y-auto bg-white">
                  {adminTab === 'config' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                          <h3 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wide">Imagem de Fundo</h3>
                          <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-3 gap-2">
                              {NATHAN_PHOTOS.map((photo, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setEditBg(photo)}
                                  className={`rounded-lg overflow-hidden border-2 transition-all h-16 ${editBg === photo ? 'border-yellow-400 shadow-md scale-105' : 'border-slate-300 hover:border-yellow-200'}`}
                                >
                                  <img src={photo} alt={`Nathan ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                            <label className="cursor-pointer bg-slate-800 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-700 transition flex items-center justify-center gap-2 shadow-sm w-full">
                              <Upload className="w-4 h-4" />
                              Outra Imagem
                              <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
                            </label>
                            {editBg && (
                              <img src={editBg} alt="Preview" className="h-20 w-full rounded-lg object-cover border border-slate-300 shadow-sm" />
                            )}
                          </div>
                        </div>

                        <div className="bg-green-50 p-5 rounded-2xl border border-green-200">
                          <h3 className="font-bold text-green-800 mb-3 text-xs uppercase tracking-wide">Agradecimento (PIX)</h3>
                          <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-3 gap-2">
                              {NATHAN_PHOTOS.map((photo, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setEditThankYouImg(photo)}
                                  className={`rounded-lg overflow-hidden border-2 transition-all h-16 ${editThankYouImg === photo ? 'border-green-600 shadow-md scale-105' : 'border-green-200 hover:border-green-400'}`}
                                >
                                  <img src={photo} alt={`Nathan ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                            <label className="cursor-pointer bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm w-full">
                              <Upload className="w-4 h-4" />
                              Outra Foto
                              <input type="file" accept="image/*" onChange={handleThankYouUpload} className="hidden" />
                            </label>
                            {editThankYouImg && (
                              <img src={editThankYouImg} alt="Preview" className="h-20 w-full rounded-lg object-cover border border-green-300 shadow-sm" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-wide">Configurar Brinquedos/Sonhos</h3>
                        <div className="space-y-4">
                          {editGifts.map((g, idx) => (
                            <div key={g.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                              <div>
                                <label className="block text-xs text-slate-500 mb-1 font-medium">Nome</label>
                                <input 
                                  type="text" 
                                  value={g.name}
                                  onChange={e => handleGiftEdit(idx, 'name', e.target.value)}
                                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-[10px] text-slate-500 mb-1 font-medium">Meta (R$)</label>
                                  <input 
                                    type="number" 
                                    value={g.target}
                                    onChange={e => handleGiftEdit(idx, 'target', e.target.value)}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-slate-500 mb-1 font-medium">Arrecadado (R$)</label>
                                  <input 
                                    type="number" 
                                    value={g.current}
                                    onChange={e => handleGiftEdit(idx, 'current', e.target.value)}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-slate-500 mb-1 font-medium">Foto</label>
                                  <label className="cursor-pointer bg-slate-700 text-white text-[10px] font-semibold px-2 py-2 rounded-lg hover:bg-slate-800 transition flex items-center justify-center w-full shadow-sm">
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                    <input type="file" accept="image/*" onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        compressImage(file, 300, (compressedBase64) => {
                                          handleGiftEdit(idx, 'image', compressedBase64);
                                        });
                                      }
                                    }} className="hidden" />
                                  </label>
                                </div>
                              </div>
                              {g.image && g.image.startsWith('data:') && (
                                <div className="flex justify-center">
                                  <img src={g.image} alt={g.name} className="h-16 w-16 rounded-lg object-cover border border-slate-300 shadow-sm" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={saveAdminData}
                        className="w-full py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Save className="w-5 h-5" />
                        Salvar Configurações
                      </button>
                    </div>
                  )}

                  {adminTab === 'dashboard' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                          <p className="text-xs text-blue-600 font-bold uppercase">Confirmados</p>
                          <p className="text-3xl font-serif text-blue-900 mt-1">{dashboardStats.totalConfirmed}</p>
                        </div>
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
                          <p className="text-xs text-red-600 font-bold uppercase">Ausências</p>
                          <p className="text-3xl font-serif text-red-900 mt-1">{dashboardStats.totalAbsent}</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-center">
                          <p className="text-xs text-orange-600 font-bold uppercase">Pendentes</p>
                          <p className="text-3xl font-serif text-orange-900 mt-1">{dashboardStats.totalPending}</p>
                        </div>
                        <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
                          <p className="text-xs text-green-600 font-bold uppercase">Total</p>
                          <p className="text-3xl font-serif text-green-900 mt-1">{dashboardStats.totalPeople}</p>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-4 rounded-xl">
                        <h3 className="font-bold text-slate-800 mb-4">Detalhes por Família</h3>
                        <div className="space-y-4">
                          {FAMILIAS_DB.map(familia => {
                            const presenca = presencasDB[familia.codigo];
                            if (!presenca) return null;

                            return (
                              <div key={familia.codigo} className="border border-slate-200 p-4 rounded-lg bg-slate-50">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-bold text-slate-800">{familia.familia}</h4>
                                    <p className="text-xs text-slate-500">({familia.codigo})</p>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    presenca.status === 'presente' ? 'bg-green-100 text-green-800' :
                                    presenca.status === 'ausente' ? 'bg-red-100 text-red-800' :
                                    'bg-orange-100 text-orange-800'
                                  }`}>
                                    {presenca.status === 'presente' ? 'Vai' : presenca.status === 'ausente' ? 'Ausente' : 'Pendente'}
                                  </span>
                                </div>

                                {presenca.status === 'presente' && presenca.membros_confirmados && presenca.membros_confirmados.length > 0 && (
                                  <div className="text-sm mb-3">
                                    <p className="text-slate-700 font-semibold text-xs uppercase text-slate-500 mb-1">
                                      Confirmados ({presenca.membros_confirmados.length}):
                                    </p>
                                    <p className="text-slate-700">{presenca.membros_confirmados.join(', ')}</p>
                                  </div>
                                )}

                                {presenca.status === 'presente' && presenca.preferencias && (
                                  <div className="text-sm space-y-2">
                                    {presenca.preferencias.comidas && presenca.preferencias.comidas.length > 0 && (
                                      <div>
                                        <p className="text-slate-700 font-semibold text-xs uppercase text-slate-500">Comida:</p>
                                        <p className="text-slate-700">{presenca.preferencias.comidas.join(', ')}</p>
                                      </div>
                                    )}
                                    {presenca.preferencias.bebidas && presenca.preferencias.bebidas.length > 0 && (
                                      <div>
                                        <p className="text-slate-700 font-semibold text-xs uppercase text-slate-500">Bebida:</p>
                                        <p className="text-slate-700">{presenca.preferencias.bebidas.join(', ')}</p>
                                      </div>
                                    )}
                                    {presenca.preferencias.restricoes && presenca.preferencias.restricoes.length > 0 && (
                                      <div>
                                        <p className="text-slate-700 font-semibold text-xs uppercase text-red-600">Restrições:</p>
                                        <p className="text-red-600 text-sm">{presenca.preferencias.restricoes.join(', ')}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {dashboardStats.sortedFoods.length > 0 && (
                        <div className="bg-white border border-slate-200 p-4 rounded-xl">
                          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-orange-500" />
                            Comidas Mais Pedidas
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {dashboardStats.sortedFoods.map(([food, count]) => (
                              <span key={food} className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {food} ({count})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {dashboardStats.sortedDrinks.length > 0 && (
                        <div className="bg-white border border-slate-200 p-4 rounded-xl">
                          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-blue-500" />
                            Bebidas Mais Pedidas
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {dashboardStats.sortedDrinks.map(([drink, count]) => (
                              <span key={drink} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {drink} ({count})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {dashboardStats.restricoes.length > 0 && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                          <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Restrições Alimentares
                          </h3>
                          <ul className="text-sm text-red-700 space-y-1 list-disc pl-5">
                            {dashboardStats.restricoes.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {adminTab === 'financeiro' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-2xl text-center">
                        <h3 className="text-sm font-bold text-green-800 uppercase mb-2">Arrecadação Total</h3>
                        <p className="text-4xl font-serif text-green-900">
                          R$ {gifts.reduce((acc, g) => acc + (g.current || 0), 0).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <main className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-8">
        {step === 1 && renderStep1Welcome()}
        {step === 2 && renderStep2Login()}
        {step === 3 && renderStep3Confirm()}
        {step === 4 && renderStep4Gifts()}
      </main>

      {/* MODAL DE PAGAMENTO PIX */}
      {selectedGift && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button 
              type="button"
              onClick={() => setSelectedGift(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-serif text-slate-800 mb-2">Contribuir para:</h3>
            <p className="font-medium text-yellow-600 mb-6">{selectedGift.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Qual valor deseja contribuir?</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-500">R$</span>
                  <input 
                    type="number" 
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-3">
                <p className="text-sm font-medium text-slate-700">Chave PIX (Celular):</p>
                <p className="font-mono text-slate-900 bg-white py-2 px-3 rounded-lg border border-slate-200 font-bold tracking-widest text-lg">
                  81997083244
                </p>
                <button 
                  type="button"
                  onClick={copyPix}
                  className="mx-auto flex items-center gap-2 text-sm font-medium text-yellow-600 hover:text-yellow-700"
                >
                  {pixCopied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {pixCopied ? 'Chave copiada!' : 'Copiar Chave PIX'}
                </button>
              </div>

              <button 
                type="button"
                onClick={processDonation}
                disabled={!donationAmount || Number(donationAmount) <= 0}
                className="w-full py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition disabled:opacity-50"
              >
                Já realizei o PIX
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE AGRADECIMENTO */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl text-center">
            
            <div className="relative h-64 md:h-72 w-full bg-slate-100">
              <img 
                src={thankYouImg} 
                alt="Nathan" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
            </div>

            <div className="px-6 pb-8 pt-2 relative z-10 -mt-8">
              <div className="inline-flex items-center justify-center p-3 bg-yellow-100 text-yellow-600 rounded-full mb-4 shadow-sm">
                <PartyPopper className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-serif text-slate-800 mb-3">Muito Obrigado!</h3>
              <p className="text-slate-600 mb-6">
                O Nathan ficou muito feliz com o seu presente de <span className="font-bold text-green-600">R$ {lastDonationAmount}</span>! ☀️💛
              </p>
              
              <button 
                type="button"
                onClick={() => setShowThankYou(false)}
                className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700"
              >
                Voltar aos Presentes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão ADM */}
      <button 
        onClick={() => { setShowAdmin(true); setEditBg(bgImage); setEditThankYouImg(thankYouImg); setEditGifts(gifts); setAdminTab('config'); }}
        className="absolute bottom-2 right-4 text-[10px] text-slate-300 hover:text-slate-500 z-[60] cursor-pointer"
      >
        admin
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        
        body { font-family: 'Outfit', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 15s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }

        .section-dreams {
          background-image: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${bgImage}');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .glass-card-premium {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
          border-radius: 24px;
        }

        .toy-card-premium {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
        }

        .toy-card-premium:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }

        .progress-bar {
          height: 100%;
          border-radius: 8px;
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}} />
    </div>
  );
}
