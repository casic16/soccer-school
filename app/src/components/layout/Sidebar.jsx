{/* Logo */}
<div className="px-4 pt-5 pb-4">
  <button
    onClick={() => navigate('/dashboard')}
    className="flex items-center gap-3 w-full text-left group"
  >
    {/* Renard */}
    <div
      className="
        w-[52px]
        h-[52px]
        rounded-xl
        bg-white
        flex
        items-center
        justify-center
        flex-shrink-0
        overflow-hidden
        shadow-sm
        border
        border-white/10
        transition-transform
        duration-200
        group-hover:scale-[1.03]
      "
    >
      <img
        src="/fariki-icon.png"
        alt="Fariki"
        className="
          w-[44px]
          h-[44px]
          object-contain
          object-center
        "
      />
    </div>

    {/* Nom */}
    <div className="min-w-0">
      <p
        className="
          font-heading
          font-extrabold
          text-[24px]
          leading-none
          tracking-tight
        "
        style={{ color: '#ef3038' }}
      >
        Fariki
      </p>

      <p className="text-[10px] text-white/40 mt-1.5 tracking-wide">
        Club Management
      </p>
    </div>
  </button>
</div>