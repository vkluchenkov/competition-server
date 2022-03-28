import { OrderFestivalDto } from 'src/festivals/order-festival.dto';
import { Registration } from 'src/registrations/registration.entity';
import { Order } from '../../order.entity';

interface GetDiffProps {
  order?: Order | null;
  contentPayload: OrderFestivalDto;
  registration?: Registration | null;
}

export const getWorshopsDiff = ({
  order,
  contentPayload,
  registration,
}: GetDiffProps): number[] => {
  const regArr = registration.workshops;
  const payloadArr = contentPayload.workshops;

  const regDiff = () => {
    if (registration) {
      // Data present in both Reg and Payload
      if (regArr.length > 0 && !!payloadArr.length) {
        // Return only new items (diff between Payload and Reg)
        return payloadArr.filter((payloadItem) =>
          regArr.some((regItem) => payloadItem != regItem),
        );
      }
      // No data in Reg, but there is in Payload
      if (regArr.length === 0 && !!payloadArr.length) {
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
    const orderArr = orderContent[index].workshops;

    // 1.1 and no Reg
    if (!registration) {
      // return Payload items, if present
      if (payloadArr && payloadArr.length > 0) {
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
      if (regArr.length === 0 && payloadArr.length === 0 && index >= 0) {
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
    return payloadArr && payloadArr.length > 0 ? payloadArr : [];
  }
};
