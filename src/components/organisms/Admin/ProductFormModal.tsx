"use client";

import { useState } from "react";
import type { FC, FormEvent } from "react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    price: number;
    description: string;
    collectionSlug: string;
    categorySlug: string;
    material: string;
    fit: "SLIM" | "REGULAR" | "RELAXED";
    status: "ACTIVE" | "DRAFT";
  }) => void;
  isPending: boolean;
}

export const ProductFormModal: FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(450000);
  const [description, setDescription] = useState("");
  const [collectionSlug, setCollectionSlug] = useState("tactix");
  const [categorySlug, setCategorySlug] = useState("outerwear");
  const [material, setMaterial] = useState("Technical Weatherproof Shell");
  const [fit, setFit] = useState<"SLIM" | "REGULAR" | "RELAXED">("REGULAR");
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT">("ACTIVE");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      price: Number(price),
      description,
      collectionSlug,
      categorySlug,
      material,
      fit,
      status,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg border border-line bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
          <h3
            id="product-modal-title"
            className="text-sm font-bold uppercase tracking-wider text-black"
          >
            Add New Studio Product
          </h3>
          <button type="button" onClick={onClose} className="text-xs text-muted hover:text-black">
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label
              htmlFor="prod-name"
              className="block text-[10px] font-semibold uppercase text-muted mb-1"
            >
              Product Name
            </label>
            <input
              id="prod-name"
              required
              placeholder="e.g. Urban Tactical Shell"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="prod-price"
                className="block text-[10px] font-semibold uppercase text-muted mb-1"
              >
                Price (IDR)
              </label>
              <input
                id="prod-price"
                type="number"
                required
                min={1000}
                step={50000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="prod-collection"
                className="block text-[10px] font-semibold uppercase text-muted mb-1"
              >
                Collection
              </label>
              <select
                id="prod-collection"
                value={collectionSlug}
                onChange={(e) => setCollectionSlug(e.target.value)}
                className="w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
              >
                <option value="tactix">TACTIX</option>
                <option value="apextive">APEXTIVE</option>
                <option value="outdoor">OUTDOOR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="prod-category"
                className="block text-[10px] font-semibold uppercase text-muted mb-1"
              >
                Category
              </label>
              <select
                id="prod-category"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
              >
                <option value="outerwear">Outerwear</option>
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="prod-fit"
                className="block text-[10px] font-semibold uppercase text-muted mb-1"
              >
                Fit Silhouette
              </label>
              <select
                id="prod-fit"
                value={fit}
                onChange={(e) => setFit(e.target.value as "SLIM" | "REGULAR" | "RELAXED")}
                className="w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
              >
                <option value="REGULAR">Regular Fit</option>
                <option value="SLIM">Slim Articulated</option>
                <option value="RELAXED">Relaxed Oversized</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="prod-material"
              className="block text-[10px] font-semibold uppercase text-muted mb-1"
            >
              Fabric & Material
            </label>
            <input
              id="prod-material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="prod-desc"
              className="block text-[10px] font-semibold uppercase text-muted mb-1"
            >
              Description
            </label>
            <textarea
              id="prod-desc"
              rows={2}
              placeholder="Design intention and purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="prod-status"
              className="block text-[10px] font-semibold uppercase text-muted mb-1"
            >
              Publication Status
            </label>
            <select
              id="prod-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "ACTIVE" | "DRAFT")}
              className="w-full border border-control bg-surface px-3 py-2 text-xs focus:border-black focus:outline-none"
            >
              <option value="ACTIVE">ACTIVE (Published to Store)</option>
              <option value="DRAFT">DRAFT (Unpublished)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="border border-control px-4 py-2 text-[10px] uppercase font-semibold text-muted hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="border border-black bg-black px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-white hover:opacity-85 disabled:opacity-50"
            >
              {isPending ? "CREATING..." : "CREATE PRODUCT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
