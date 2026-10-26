export default function FaceScanner({
  scanning,
}: {
  scanning: boolean;
}) {

  if (!scanning) return null;

  return (
    <div
      className="
      absolute
      inset-0
      flex
      items-center
      justify-center
      pointer-events-none
      "
    >

      <div
        className="
        relative
        w-64
        h-80
        border-4
        border-green-500
        rounded-xl
        overflow-hidden
        shadow-[0_0_20px_#22c55e]
        "
      >

        <div
          className="
          absolute
          top-0
          left-0
          w-full
          h-1
          bg-green-400
          animate-scan-line
          "
        />

      </div>

      <div
        className="
        absolute
        bottom-6
        bg-black/70
        text-white
        px-4
        py-2
        rounded-full
        "
      >
        AI Face Analysis...
      </div>

    </div>
  );
}