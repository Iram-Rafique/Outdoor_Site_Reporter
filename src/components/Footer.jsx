function Footer() {
  return (
    <footer className="border-t border-[#DCE3DE] bg-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-1 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="text-base font-semibold tracking-[-0.03em] text-[#153A30]">
          Outdoor
          <span className="font-light text-[#5B6A63]"> Reporter</span>
        </span>
        <span className="text-sm text-[#5B6A63]">
          &copy; {new Date().getFullYear()} Outdoor Reporter
        </span>
      </div>
    </footer>
  )
}

export default Footer
