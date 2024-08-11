import styles from "./index.module.css";

interface NameType {
  title: string;
  first: string;
  last: string;
}
interface CustomerInfoCardProps {
  name: NameType;
  onClick: () => void;
  selectedCardIndex: number | null;
  index: number;
}

const CustomerInfoCard = ({
  name,
  onClick,
  selectedCardIndex,
  index,
}: CustomerInfoCardProps) => {
  return (
    <div
      className={styles["card"]}
      onClick={onClick}
      style={{
        backgroundColor: index === selectedCardIndex ? "#eeeeee" : undefined,
        borderRight: index === selectedCardIndex ? "1px solid #333" : undefined,
      }}
    >
      <span className={styles["name"]}>
        {name.title}. {name.first} {name.last}
      </span>
    </div>
  );
};

export default CustomerInfoCard;
