import { ExpertData } from "../types/expertType";
import { fetchExpertDataBackend } from "../utils/api";
import ExpertProfilePage from "./ExpertProfilePage";
import { Metadata } from "next";

const Expert = async ({ params }: { params: { username: string } }) => {
  let expertData: ExpertData;

  try {
    const response = await fetchExpertDataBackend(params.username);

    console.log(
      `Username received in fetchExpertDataBackend: ${params.username}`
    );
    console.log(`response data: ${JSON.stringify(response)}`);

    if (response.success && response.data && response.data.expert) {
      expertData = {
        expertProfile: response.data.expert.expertId,
        expertUser: {
          _id: response.data.expert._id,
          name: response.data.expert.name,
          profilePicture: response.data.expert.profilePicture,
          bio: response.data.expert.bio,
          isVerified: response.data.expert.isVerified,
        },
        reviews: response.data.reviews || [],
        totalReviews: response.data.totalReviews || 0,
        averageRating:
          response.data.averageRating !== null
            ? Number(response.data.averageRating)
            : null,
        totalMeetings: response.data.totalMeetings || 0,
        loading: false,
        error: null,
      };
    } else {
      expertData = {
        expertProfile: null,
        expertUser: {
          _id: "",
          name: params.username,
          profilePicture: "/images/avatar.jpg",
          bio: "User doesn't exist",
          isVerified: false,
        },
        reviews: [],
        totalReviews: 0,
        averageRating: null,
        totalMeetings: 0,
        loading: false,
        error: "User doesn't exist",
      };
    }
  } catch (error) {
    console.error("Error fetching expert data:", error);
    expertData = {
      expertProfile: null,
      expertUser: {
        _id: "",
        name: params.username,
        profilePicture: "/images/default-profile-picture.png",
        bio: "User doesn't exist",
        isVerified: false,
      },
      reviews: [],
      totalReviews: 0,
      averageRating: null,
      totalMeetings: 0,
      loading: false,
      error: "User doesn't exist",
    };
  }

  return (
    <ExpertProfilePage expertData={expertData} username={params.username} />
  );
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
    const response = await fetchExpertDataBackend(username);

    if (response.success && response.data && response.data.expert) {
      const expertUser = response.data.expert;
      const expertProfile = response.data.expert.expertId;

      return {
        title: expertUser.name,
        description: expertProfile.profession,
        twitter: {
          card: "summary_large_image",
        },
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
