import { useRouter } from "next/router";

function ItemDetail() {
  const router = useRouter();
  const { itemId } = router.query;

  return <div>아이템 상세 페이지: {itemId}</div>;
}

export default ItemDetail;