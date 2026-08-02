export function BackgroundGlow() {
  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden'>
      <div className='absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-[100px] sm:-left-32 sm:h-96 sm:w-96 sm:blur-[150px]' />
      <div className='absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px] sm:h-96 sm:w-96 sm:blur-[150px]' />
    </div>
  );
}
