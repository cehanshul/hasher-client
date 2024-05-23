import { ExpertData } from "../types/expertType";
import { fetchExpertDataBackend } from "../utils/api";
import ExpertProfilePage from "./ExpertProfilePage";
import { Metadata } from "next";

const Expert = async ({ params }: { params: { username: string } }) => {
  try {
    const response = await fetchExpertDataBackend(params.username);
    if (response.success && response.data && response.data.expert) {
      const expertData: ExpertData = {
        expertProfile: response.data.expert.expertId,
        expertUser: {
          _id: response.data.expert._id,
          name: response.data.expert.name,
          profilePicture: response.data.expert.profilePicture,
          bio: response.data.expert.bio,
          isVerified: response.data.expert.isVerified,
        },
        reviews: response.data.reviews,
        totalReviews: response.data.totalReviews,
        averageRating:
          response.data.averageRating !== null
            ? Number(response.data.averageRating)
            : null,
        totalMeetings: response.data.totalMeetings,
        loading: false,
        error: null,
      };
      return <ExpertProfilePage expertData={expertData} />;
    } else {
      throw new Error("Failed to fetch expert data");
    }
  } catch (error) {
    console.error("Error fetching expert data:", error);
    return <div>Error: {(error as Error).message}</div>;
  }
};

export default Expert;

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return generateMetadataFromExpertMetadata({ username: params.username });
}

async function generateMetadataFromExpertMetadata({
  username,
}: {
  username: string;
}): Promise<Metadata> {
  try {
    console.log(`Username for getmetadata ${username}`);
    const response = await fetchExpertDataBackend(username);
    console.log(
      `Response for expertExpertDatabackend ${JSON.stringify(response)}`
    );
    if (response.success && response.data && response.data.expert) {
      const expertUser = response.data.expert;
      const expertProfile = response.data.expert.expertId;
      return {
        title: expertUser.name,
        description: expertProfile.profession,
        openGraph: {
          title: expertUser.name,
          description: expertProfile.profession,
          images: [
            {
              url: expertUser.profilePicture,
              width: 800,
              height: 600,
              alt: expertUser.name,
            },
          ],
        },
      };
    }
    // Return default metadata if the expert data is missing or doesn't match the expected structure
    return {
      title: "Expert Profile",
      description: "Expert profile page",
    };
  } catch (error) {
    console.error("Failed to fetch expert data:", error);
    // Return default metadata as a fallback
    return {
      title: "Expert Profile",
      description: "Expert profile page",
    };
  }
}
