import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { Id } from 'objection';
import { Cuboid } from '../models';

export const list = async (req: Request, res: Response): Promise<Response> => {
  const ids = req.query.ids as Id[];
  const cuboids = await Cuboid.query().findByIds(ids).withGraphFetched('bag');

  return res.status(200).json(cuboids);
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const cuboid = await Cuboid.query().findById(id);

  if (cuboid) {
    cuboid.volume = cuboid.width * cuboid.depth * cuboid.depth;
    return res.status(HttpStatus.OK).json(cuboid);
  }
  return res.sendStatus(HttpStatus.NOT_FOUND);
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { width, height, depth, bagId } = req.body;

  const cuboid = await Cuboid.query().insert({
    width,
    height,
    depth,
    bagId,
  });
  return res.status(HttpStatus.CREATED).json(cuboid);
};
