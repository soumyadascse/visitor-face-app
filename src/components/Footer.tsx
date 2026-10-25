export default function Footer() {
  return (
    <footer
      className="
      bg-gray-800
      text-white
      p-4
      "
    >
      <p className="text-center">
        &copy; {new Date().getFullYear()} Visitor AI. All rights reserved. Practice App Developed by Soumya Das
      </p>
    </footer>
  );
}
