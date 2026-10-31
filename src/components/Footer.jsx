
function Footer() {
  return (
    <footer className="border-t border-[#E1E8E5] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-[#5A6B66]">
          &copy; {new Date().getFullYear()} Outdoor Reporter
        </p>
      </div>
    </footer>
  )
}

export default Footer
