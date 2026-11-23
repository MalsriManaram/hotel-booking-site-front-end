import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router";
import { CheckCircle2, Sparkles, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetReviewsByHotelQuery,
  useUpsertReviewMutation,
  useDeleteReviewMutation,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HotelReviews = ({ hotelId, hotelRating, hotelReviewsCount }) => {
  const { isSignedIn, user } = useUser();
  const { data, isLoading } = useGetReviewsByHotelQuery(hotelId, {
    skip: !hotelId,
  });
  const [upsertReview, { isLoading: isSubmitting }] = useUpsertReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const [rating, setRating] = useState(5);
  const [tripType, setTripType] = useState("Couple");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const reviews = data?.reviews || [];
  const summary = data?.summary || {};
  const isAdmin = user?.publicMetadata?.role === "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim().length < 5) {
      toast.error("Please write at least 5 characters for your review");
      return;
    }
    try {
      await upsertReview({
        hotelId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        tripType,
        userName: user?.fullName || user?.firstName || "StayLux Guest",
        userAvatar: user?.imageUrl || "",
      }).unwrap();
      toast.success("Thank you! Your review has been published.");
      setTitle("");
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview({ id, hotelId }).unwrap();
      toast.success("Review removed");
    } catch {
      toast.error("Could not delete review");
    }
  };

  return (
    <section id="reviews" className="mt-14 pt-10 border-t space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Guest Reviews & Sentiment Insights
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Overall Rating:{" "}
            <strong className="text-foreground">
              {hotelRating && hotelRating > 0 ? `${hotelRating} / 5` : "New"}
            </strong>{" "}
            ({hotelReviewsCount ? hotelReviewsCount.toLocaleString() : 0} total ratings)
          </p>
        </div>
      </div>

      {/* AI Review Summary + Rating Breakdown */}
      {summary.totalWrittenReviews > 0 && (
        <Card className="rounded-2xl bg-gradient-to-br from-amber-50/70 to-white border-amber-200/70">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
                <Sparkles className="h-4 w-4 text-amber-600" />
                AI Review Highlights
              </div>
              <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                {summary.aiSummary}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(summary.praisedHighlights || []).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white border border-amber-200 text-amber-900"
                  >
                    ✓ {tag}
                  </Badge>
                ))}
                {summary.topTripType && (
                  <Badge className="bg-black text-white">
                    Popular with {summary.topTripType}s
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.distribution?.[star] || 0;
                const pct =
                  summary.totalWrittenReviews > 0
                    ? Math.round((count / summary.totalWrittenReviews) * 100)
                    : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-8 font-medium">{star} ★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Write a Review Form */}
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold">Share Your Experience</h3>
            {!isSignedIn ? (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Sign in to rate this hotel and share feedback with fellow travelers.</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/sign-in">Sign In to Write a Review</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            num <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-semibold">
                      {rating}.0 / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Travel Type
                  </label>
                  <Select value={tripType} onValueChange={setTripType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Couple">Couple</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Solo">Solo Traveler</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Friends">Friends Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Headline (Optional)
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Unforgettable harbour views!"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Your Review
                  </label>
                  <Textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you love about the rooms, location, or service?"
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Written Reviews Feed */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <Card className="rounded-2xl p-8 text-center bg-gray-50/70 border-dashed">
              <p className="font-medium text-gray-700">
                No written guest reviews yet for this property.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Be the first guest to share your thoughts!
              </p>
            </Card>
          ) : (
            reviews.map((rev) => (
              <Card key={rev._id} className="rounded-2xl shadow-sm">
                <CardContent className="p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {rev.userAvatar ? (
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center">
                          {rev.userName?.charAt(0) || "G"}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">
                            {rev.userName}
                          </span>
                          {rev.verifiedStay && (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 text-[11px] gap-1"
                            >
                              <CheckCircle2 className="h-3 w-3" /> Verified Stay
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[11px]">
                            {rev.tripType}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-full">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-900">
                          {rev.rating}.0
                        </span>
                      </div>
                      {(user?.id === rev.userId || isAdmin) && (
                        <button
                          type="button"
                          onClick={() => handleDelete(rev._id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          title="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {rev.title && (
                    <h4 className="font-semibold text-base">{rev.title}</h4>
                  )}
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {rev.comment}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default HotelReviews;
