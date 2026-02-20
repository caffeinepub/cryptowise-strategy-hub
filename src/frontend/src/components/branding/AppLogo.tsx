export function AppLogo() {
  return (
    <picture>
      <source srcSet="/assets/generated/cryptowise-logo.dim_512x512.png" type="image/png" />
      <img
        src="/assets/generated/cryptowise-logo.dim_512x512.png"
        alt="CryptoWise Logo"
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
        loading="eager"
      />
    </picture>
  );
}
