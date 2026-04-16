import React from "react";
import toast from "react-hot-toast";
const ProductReviews = ({ reviews }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
            <h3 className="text-lg font-bold mb-4">Customer Reviews</h3>
            {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet.</p>

            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 pb-4">
                            <p className="text-gray-800 font-semibold">{review.user.name}</p>
                            <p className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                            <p className="text-gray-600">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
