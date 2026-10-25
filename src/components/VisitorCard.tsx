type Props = {
  name: string;
  age: number;
  gender: string;
  emotion: string;
};

export default function VisitorCard({
  name,
  age,
  gender,
  emotion
}: Props) {

  return (

    <div
      className="
      bg-white
      p-4
      rounded-xl
      shadow
      "
    >

      <h2
        className="
        text-xl
        font-bold
        mb-4
        "
      >
        Visitor Info
      </h2>

      <p>Name: {name}</p>

      <p>Age: {age}</p>

      <p>Gender: {gender}</p>

      <p>Emotion: {emotion}</p>

    </div>

  );
}