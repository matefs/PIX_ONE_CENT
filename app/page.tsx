import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Informe seu CPF ou CNPJ",
    description:
      "O usuário informa seu documento fiscal. Aceitamos CPF (pessoa física) e CNPJ (pessoa jurídica) para máxima flexibilidade.",
    badge: null,
  },
  {
    number: "02",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Cobrança gerada na Woovi",
    description:
      "Criamos uma cobrança Pix de R$ 0,01 via API da Woovi vinculada ao CPF/CNPJ informado. O valor simbólico garante rastreabilidade sem ônus ao usuário.",
    badge: null,
  },
  {
    number: "03",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
    title: "QR Code exibido na tela",
    description:
      "O QR Code Pix é gerado e apresentado em tempo real. O usuário escaneia pelo app do banco — sem redirecionamentos, sem atrito.",
    badge: null,
  },
  {
    number: "04",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Pagamento confirmado",
    description:
      "Nosso sistema faz polling automático na API da Woovi. Assim que o pagamento é liquidado, os dados do pagante são retornados na resposta — incluindo o documento real usado na transação.",
    badge: null,
  },
  {
    number: "05",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Consulta via BigBoost",
    description:
      "O CPF confirmado é consultado na base da BigBoost para recuperar a data de nascimento e demais dados cadastrais do titular real da conta Pix.",
    badge: "Em breve",
  },
  {
    number: "06",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Idade validada",
    description:
      "Com a data de nascimento em mãos, calculamos a idade e liberamos ou bloqueamos o acesso. Simples, preciso e sem depender de autodeclaração.",
    badge: "Em breve",
  },
];

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Verificação em segundos",
    description:
      "O Pix liquida em tempo real. A confirmação chega em segundos, não em dias como em outros métodos de KYC.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Dado direto do banco",
    description:
      "O CPF retornado vem da conta bancária real do pagante, não de um formulário. Impossível de falsificar sem acesso ao banco.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Custo irrisório",
    description:
      "R$ 0,01 por validação. Sem mensalidade de bureau de crédito, sem contrato mínimo, sem overhead operacional.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "UX nativa",
    description:
      "O usuário já usa Pix todo dia. Não há nova interface para aprender — só escanear o QR no app do banco que já conhece.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-woovi-dark">
      {/* Nav */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-woovi-green rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-woovi-dark">One cent</span>
            <span className="ml-2 text-xs font-semibold bg-woovi-green/15 text-woovi-green px-2 py-0.5 rounded-full tracking-wide uppercase">
              Age Verify
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/validate"
              className="bg-woovi-green text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-green-500/20 hover:scale-105 transition-all active:scale-95 text-sm"
            >
              Testar agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-green-50 text-woovi-green px-4 py-2 rounded-full font-semibold text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-woovi-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-woovi-green" />
              </span>
              Validação etária via Pix — R$ 0,01
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              Comprove a{" "}
              <span className="text-woovi-green">maior&shy;idade</span>{" "}
              com um centavo de Pix
            </h1>

            <p className="text-xl text-woovi-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Em vez de pedir foto de documento — que qualquer um pode falsificar — usamos o Pix para obter o CPF real diretamente do banco do usuário e confirmar se ele tem 18 anos ou mais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/validate"
                className="bg-woovi-dark text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all text-center"
              >
                Ver o fluxo ao vivo
              </Link>
              <a
                href="#como-funciona"
                className="border-2 border-gray-200 text-woovi-dark px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all text-center"
              >
                Como funciona
              </a>
            </div>
          </div>

          {/* Hero card */}
          <div className="lg:w-1/2 relative w-full max-w-md mx-auto lg:mx-0">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-woovi-green/10 rounded-full blur-3xl pointer-events-none" />
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-woovi-muted">
                    Cobrança de validação
                  </p>
                  <p className="text-4xl font-extrabold mt-1">R$ 0,01</p>
                </div>
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-woovi-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "CPF informado", value: "•••.456.789-••", done: true },
                  { label: "Cobrança gerada", value: "Woovi API", done: true },
                  { label: "QR Code exibido", value: "Aguardando scan", done: true },
                  { label: "Pagamento confirmado", value: "R$ 0,01 liquidado", done: true },
                  { label: "Consulta BigBoost", value: "Data de nascimento", done: false },
                  { label: "Idade validada", value: "≥ 18 anos ✓", done: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      item.done
                        ? "border-woovi-green/30 bg-green-50"
                        : "border-dashed border-gray-200 bg-gray-50 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.done ? "bg-woovi-green" : "border-2 border-gray-300"
                        }`}
                      >
                        {item.done && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-woovi-dark">{item.label}</span>
                    </div>
                    <span className="text-xs text-woovi-muted font-mono">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-medium text-woovi-muted">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Powered by Woovi + BigBoost
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Problema: ECA Digital */}
      <section className="py-24 px-6 bg-woovi-dark overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-woovi-green">
                O Problema
              </span>
              <h2 className="text-4xl font-bold text-white leading-tight">
                O ECA Digital exige verificação de idade — mas ninguém verifica de verdade
              </h2>
              <p className="text-gray-400 leading-relaxed">
                A Lei nº 14.811/2024 (o "ECA Digital") tornou obrigatória a verificação de maioridade em plataformas digitais que oferecem conteúdo adulto, jogos de azar, bebidas alcoólicas e outras categorias restritas. Quem não cumprir está sujeito a multas e bloqueio de serviço.
              </p>
              <p className="text-gray-400 leading-relaxed">
                O problema é que a lei não diz <em className="text-white not-italic font-semibold">como</em> verificar. A maioria das plataformas ainda usa autodeclaração — uma caixa de checkbox onde o usuário clica em "Tenho 18 anos" — o que não protege ninguém.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  label: "Autodeclaração",
                  description: "Usuário clica numa caixa. Nenhuma verificação real.",
                  bad: true,
                },
                {
                  label: "Upload de documento",
                  description: "Fácil de falsificar. Cria risco de LGPD com dados sensíveis armazenados.",
                  bad: true,
                },
                {
                  label: "Reconhecimento facial",
                  description: "Caro, intrusivo e depende de infraestrutura biométrica.",
                  bad: true,
                },
                {
                  label: "Pix de R$ 0,01",
                  description: "CPF real do titular da conta bancária. Sem armazenar documento. Sem atrito.",
                  bad: false,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-start gap-4 p-5 rounded-2xl border ${
                    item.bad
                      ? "border-red-900/40 bg-red-950/30"
                      : "border-woovi-green/40 bg-woovi-green/10"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.bad ? "bg-red-500/20" : "bg-woovi-green"
                    }`}
                  >
                    {item.bad ? (
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${item.bad ? "text-red-300" : "text-woovi-green"}`}>
                      {item.label}
                    </p>
                    <p className="text-gray-400 text-sm mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solução */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              {[
                { value: "R$ 0,01", label: "por verificação", sub: "sem mensalidade" },
                { value: "< 5s", label: "tempo médio", sub: "Pix em tempo real" },
                { value: "100%", label: "rastreável", sub: "CPF direto do banco" },
                { value: "0", label: "docs armazenados", sub: "conformidade LGPD" },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <p className="text-3xl font-extrabold text-woovi-dark">{stat.value}</p>
                  <p className="text-sm font-semibold text-woovi-dark mt-1">{stat.label}</p>
                  <p className="text-xs text-woovi-muted mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-woovi-green">
                A Solução
              </span>
              <h2 className="text-4xl font-bold leading-tight">
                Automação de KYC etário com o Pix como prova de identidade
              </h2>
              <p className="text-woovi-muted leading-relaxed">
                Ao pagar R$ 0,01 via Pix, o usuário prova que tem acesso à conta bancária cadastrada em seu CPF. O banco já fez o KYC — nós apenas lemos o resultado. O CPF retornado pela transação é então cruzado com bases públicas (BigBoost) para obter a data de nascimento e calcular a idade de forma automática e auditável.
              </p>
              <p className="text-woovi-muted leading-relaxed">
                Nenhum documento é armazenado. O fluxo é concluído em segundos. E a conformidade com o ECA Digital fica documentada na própria trilha de auditoria da transação Pix.
              </p>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-woovi-green/20">
                <svg className="w-5 h-5 text-woovi-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-sm text-woovi-dark font-medium">
                  Conformidade com a Lei nº 14.811/2024 (ECA Digital) sem fricção para o usuário.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-woovi-green">
              Fluxo completo
            </span>
            <h2 className="text-4xl font-bold">Como o Pix de 1 centavo valida a idade</h2>
            <p className="text-woovi-muted text-lg max-w-2xl mx-auto">
              Seis etapas automáticas — da captura do documento à liberação de acesso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 text-[7rem] font-black text-gray-50 leading-none select-none pointer-events-none -translate-y-4 translate-x-4">
                  {step.number}
                </div>

                <div className="relative">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-5 text-woovi-green group-hover:bg-woovi-green group-hover:text-white transition-colors">
                    {step.icon}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-lg font-bold">{step.title}</h4>
                    {step.badge && (
                      <span className="text-xs font-semibold bg-woovi-dark text-white px-2 py-0.5 rounded-full">
                        {step.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-woovi-muted text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que funciona */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-woovi-green">
              Vantagens
            </span>
            <h2 className="text-4xl font-bold">Por que o Pix é o melhor KYC de idade</h2>
            <p className="text-woovi-muted text-lg max-w-2xl mx-auto">
              Sem upload de documento, sem selfie, sem esperar aprovação manual.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-5 text-woovi-green group-hover:bg-woovi-green group-hover:text-white transition-colors">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-bold mb-3">{benefit.title}</h4>
                <p className="text-woovi-muted text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Próximos passos */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-woovi-green">
              Roadmap
            </span>
            <h2 className="text-4xl font-bold">Próximos passos do projeto</h2>
            <p className="text-woovi-muted text-lg max-w-2xl mx-auto">
              Transformar o fluxo em um produto que qualquer plataforma pode integrar em minutos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* SDK */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-woovi-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-woovi-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-woovi-muted">Em desenvolvimento</p>
                  <h3 className="text-xl font-bold text-woovi-dark">SDK JavaScript / TypeScript</h3>
                </div>
              </div>

              <p className="text-woovi-muted leading-relaxed">
                Pacote NPM do <strong className="text-woovi-dark">One Cent Age Verify</strong> que encapsula todo o fluxo de validação etária — geração do Pix, polling de confirmação, consulta cadastral e cálculo de idade — em uma única chamada assíncrona.
              </p>

              <div className="rounded-xl bg-woovi-dark p-4 font-mono text-sm overflow-x-auto text-gray-300">
                <p className="text-gray-500 text-xs mb-2"># instalação</p>
                <p className="text-woovi-green">npm install @one-cent/age-verify</p>
              </div>

              <div className="rounded-xl bg-woovi-dark p-4 font-mono text-sm overflow-x-auto space-y-1 text-gray-300">
                <p className="text-gray-500 text-xs mb-2"># uso</p>
                <p><span className="text-purple-400">import</span> <span className="text-white">{"{ verifyAge, WooviProvider, BigBoostProvider }"}</span> <span className="text-purple-400">from</span> <span className="text-yellow-300">&apos;@one-cent/age-verify&apos;</span></p>
                <p className="mt-2"><span className="text-purple-400">const</span> <span className="text-white">result</span> <span className="text-gray-400">=</span> <span className="text-purple-400">await</span> <span className="text-woovi-green">verifyAge</span><span className="text-gray-400">{"({"}</span></p>
                <p className="pl-4"><span className="text-blue-300">taxID</span><span className="text-gray-400">:</span> <span className="text-yellow-300">&apos;000.000.000-00&apos;</span><span className="text-gray-400">,</span></p>
                <p className="pl-4"><span className="text-blue-300">chargeProvider</span><span className="text-gray-400">:</span> <span className="text-purple-400">new</span> <span className="text-woovi-green">WooviProvider</span><span className="text-gray-400">{"({"}</span></p>
                <p className="pl-8"><span className="text-blue-300">apiURL</span><span className="text-gray-400">:</span> <span className="text-yellow-300">&apos;https://api.woovi.com/api/v1/charge&apos;</span><span className="text-gray-400">,</span></p>
                <p className="pl-8"><span className="text-blue-300">auth</span><span className="text-gray-400">:</span> <span className="text-yellow-300">&apos;sua-chave-woovi&apos;</span><span className="text-gray-400">,</span></p>
                <p className="pl-4"><span className="text-gray-400">{"}),"}</span></p>
                <p className="pl-4"><span className="text-blue-300">ageProvider</span><span className="text-gray-400">:</span> <span className="text-purple-400">new</span> <span className="text-woovi-green">BigBoostProvider</span><span className="text-gray-400">{"({"}</span></p>
                <p className="pl-8"><span className="text-blue-300">accessToken</span><span className="text-gray-400">:</span> <span className="text-yellow-300">&apos;sua-chave-bigboost&apos;</span><span className="text-gray-400">,</span></p>
                <p className="pl-8"><span className="text-blue-300">tokenId</span><span className="text-gray-400">:</span> <span className="text-yellow-300">&apos;seu-token-id-bigboost&apos;</span><span className="text-gray-400">,</span></p>
                <p className="pl-4"><span className="text-gray-400">{"}),"}</span></p>
                <p className="pl-4"><span className="text-blue-300">onQRCode</span><span className="text-gray-400">:</span> <span className="text-white">(data)</span> <span className="text-gray-400">={">"}</span> <span className="text-woovi-green">renderQR</span><span className="text-gray-400">(</span>data<span className="text-gray-400">.</span><span className="text-blue-300">brCode</span><span className="text-gray-400">),</span></p>
                <p><span className="text-gray-400">{"});"}</span></p>
                <p className="mt-2"><span className="text-white">result</span><span className="text-gray-400">.</span><span className="text-blue-300">approved</span> <span className="text-gray-500">{"// true | false"}</span></p>
                <p><span className="text-white">result</span><span className="text-gray-400">.</span><span className="text-blue-300">age</span>      <span className="text-gray-500">{"// 35"}</span></p>
              </div>
            </div>

            {/* Plugin via script */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-woovi-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-woovi-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-woovi-muted">Em desenvolvimento</p>
                  <h3 className="text-xl font-bold text-woovi-dark">Plugin via {"<script>"}</h3>
                </div>
              </div>

              <p className="text-woovi-muted leading-relaxed">
                Para plataformas sem build pipeline — WordPress, Shopify, landing pages — o plugin do <strong className="text-woovi-dark">One Cent Age Verify</strong> injeta o modal de validação etária via <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">window.OneCent</code> com uma única tag de script.
              </p>

              <div className="rounded-xl bg-woovi-dark p-4 font-mono text-sm overflow-x-auto space-y-1 text-gray-300">
                <p className="text-gray-500 text-xs mb-2"># 1. inclua o script no {"<body>"}</p>
                <p><span className="text-gray-400">{"<"}</span><span className="text-blue-300">script</span> <span className="text-blue-300">src</span><span className="text-gray-400">{"=\""}</span><span className="text-yellow-300">https://cdn.onecent.dev/v1/age-verify.js</span><span className="text-gray-400">{"\">"}</span> <span className="text-blue-300">async</span><span className="text-gray-400">{"</"}</span><span className="text-blue-300">script</span><span className="text-gray-400">{">"}</span></p>
              </div>

              <div className="rounded-xl bg-woovi-dark p-4 font-mono text-sm overflow-x-auto space-y-1 text-gray-300">
                <p className="text-gray-500 text-xs mb-2"># 2. inicialize com sua chave</p>
                <p><span className="text-purple-400">window</span>.<span className="text-woovi-green">OneCent</span>.<span className="text-blue-300">init</span>(<span className="text-white">{"{"}</span></p>
                <p className="pl-4"><span className="text-blue-300">apiKey</span><span className="text-gray-400">:</span> <span className="text-yellow-300">&apos;sua-chave-one-cent&apos;</span></p>
                <p><span className="text-white">{"}"}</span>)<span className="text-gray-400">;</span></p>
              </div>

              <div className="rounded-xl bg-woovi-dark p-4 font-mono text-sm overflow-x-auto space-y-1 text-gray-300">
                <p className="text-gray-500 text-xs mb-2"># 3. dispare e escute o resultado</p>
                <p><span className="text-purple-400">window</span>.<span className="text-woovi-green">OneCent</span>.<span className="text-blue-300">verify</span>(<span className="text-white">{"{"}</span></p>
                <p className="pl-4"><span className="text-blue-300">taxID</span><span className="text-gray-400">:</span> <span className="text-yellow-300">&apos;000.000.000-00&apos;</span><span className="text-gray-400">,</span></p>
                <p className="pl-4"><span className="text-blue-300">onSuccess</span><span className="text-gray-400">:</span> (result) <span className="text-gray-400">={">"}</span> <span className="text-white">{"{"}</span></p>
                <p className="pl-8"><span className="text-gray-500">{"// result.isAdult → true | false"}</span></p>
                <p className="pl-4"><span className="text-white">{"}"}</span></p>
                <p><span className="text-white">{"}"}</span>)<span className="text-gray-400">;</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-woovi-dark">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-woovi-green/20 text-woovi-green px-4 py-2 rounded-full font-semibold text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-woovi-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-woovi-green" />
            </span>
            Sandbox disponível para testes
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Pronto para ver o fluxo funcionando?
          </h2>

          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Clique abaixo, informe um CPF de teste e acompanhe cada etapa — da geração do QR Code à confirmação do pagamento — em tempo real.
          </p>

          <Link
            href="/validate"
            className="inline-block bg-woovi-green text-white font-bold px-10 py-5 rounded-2xl text-lg shadow-lg shadow-green-900/30 hover:scale-105 transition-all active:scale-95"
          >
            Iniciar validação →
          </Link>

          <p className="text-xs text-gray-600">
            Ambiente sandbox da Woovi · nenhuma transação real é processada
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-woovi-dark border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-woovi-green rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">One Cent</span>
              <span className="ml-1 text-xs font-semibold bg-woovi-green/20 text-woovi-green px-2 py-0.5 rounded-full tracking-wide uppercase">
                Age Verify
              </span>
            </div>
            <p className="text-gray-500 text-xs">
              Projeto experimental · Powered by Woovi Pix + BigBoost
            </p>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-300 font-semibold">Desenvolvido por</p>
                <p className="text-lg font-bold text-white">Mateus Schverz</p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/matefs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-woovi-green transition-colors text-sm font-medium"
                >
                  GitHub
                </a>
                <a
                  href="mailto:matefs8569@gmail.com"
                  className="text-gray-400 hover:text-woovi-green transition-colors text-sm font-medium"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}