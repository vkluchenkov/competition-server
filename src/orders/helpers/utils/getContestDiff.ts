import { OrderFestivalDto } from 'src/festivals/order-festival.dto';
import { Registration } from 'src/registrations/registration.entity';
import { Order } from '../../order.entity';

interface GetDiffProps {
  order?: Order | null;
  contentPayload: OrderFestivalDto;
  registration?: Registration | null;
}

export const getContestDiff = ({
  order,
  contentPayload,
  registration,
}: GetDiffProps): number[] => {
  const payloadArr = contentPayload.contest;
  const regArr = registration ? registration.contest : [];

  const regDiff = () => {
    if (registration) {
      // Data present in both Reg and Payload
      if (regArr.length && payloadArr.length) {
        // Return only new items (diff between Payload and Reg)
        return payloadArr.filter(
          (payloadItem) => !regArr.includes(payloadItem),
        );
      }
      // No data in Reg, but there is in Payload
      if (!regArr.length && payloadArr.length) {
        // return Payload items
        return payloadArr;
      }
      // No data anywhere
      return [];
    }
  };

  // 1. If active order
  if (order && order.status != 'paid') {
    const orderContent = order.content.slice();
    const index = orderContent.findIndex(
      (c) => c.festivalId === contentPayload.festivalId,
    );
    const orderArr = orderContent[index].contest;

    // 1.1 and no Reg
    if (!registration) {
      // return Payload items, if present
      if (payloadArr && payloadArr.length) {
        return payloadArr;
      }
      // return order items, if present
      if (index >= 0) {
        return orderArr;
      }
      // return empty array if nothing
      return [];
    }
    // 1.2 and there's Reg
    else {
      // If no items in Reg and Payload
      // return order items
      if (!regArr.length && !payloadArr.length && index >= 0) {
        return orderArr;
      }
      // else compare Reg and Payload
      return regDiff();
    }
  }
  // 2. No active order
  else {
    // 2.1 If Reg, compare Reg and Payload
    if (registration) return regDiff();
    // 2.2 If no Reg
    return payloadArr && payloadArr.length ? payloadArr : [];
  }
};
