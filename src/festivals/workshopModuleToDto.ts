import { Workshop } from './workshop.entity';

export const workshopModelToDto = (workshopEntity: Workshop) => {
  return {
    id: workshopEntity.id,
    topic: workshopEntity.topic,
    start: workshopEntity.start,
    end: workshopEntity.end,
    price: workshopEntity.price,
    teacher: teacher(workshopEntity.teacher_id),
  };
};
