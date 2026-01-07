import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Notification, NotificationResourceType } from '../../notifications/entities/notification.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

export async function seedNotifications(
  dataSource: DataSource,
  users: User[],
  posts: Post[],
  comments: Comment[],
): Promise<Notification[]> {
  const notificationRepository = dataSource.getRepository(Notification);
  const notifications: Notification[] = [];

  // Helper to get random user (excluding recipient for actor)
  const getRandomUser = (excludeUserId?: number) => {
    let randomUser: User;
    do {
      randomUser = users[Math.floor(Math.random() * users.length)];
    } while (excludeUserId && randomUser.id === excludeUserId);
    return randomUser;
  };

  // Helper to get random post
  const getRandomPost = () => posts[Math.floor(Math.random() * posts.length)];

  // Helper to get random comment
  const getRandomComment = () => comments[Math.floor(Math.random() * comments.length)];

  // Type 1: New Post created in a community (if applicable)
  if (posts.length > 0) {
    for (let i = 0; i < 5; i++) {
      const post = getRandomPost();
      const recipient = getRandomUser(post.author.id); // Notify someone other than the post author
      const actor = post.author;

      const notification = notificationRepository.create({
        recipient: recipient,
        actor: actor,
        type: 'New Post',
        read: Math.random() > 0.5, // 50% chance of being read
        resourceType: NotificationResourceType.POST,
        resourceId: post.id,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7), // within last 7 days
      });
      notifications.push(notification);
    }
  }

  // Type 2: New Comment on a Post
  if (comments.length > 0) {
    for (let i = 0; i < 5; i++) {
      const comment = getRandomComment();
      const post = comment.post;
      if (!post) continue; // Skip if comment has no associated post
      
      const recipient = post.author; // Notify the post author
      const actor = comment.author;

      if (recipient.id === actor.id) continue; // Don't notify if actor is recipient

      const notification = notificationRepository.create({
        recipient: recipient,
        actor: actor,
        type: 'New Comment',
        read: Math.random() > 0.5,
        resourceType: NotificationResourceType.COMMENT,
        resourceId: comment.id,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 5), // within last 5 days
      });
      notifications.push(notification);
    }
  }

  // Type 3: Reaction on a Post (assuming reactions are related to posts)
  if (posts.length > 0) {
    for (let i = 0; i < 5; i++) {
      const post = getRandomPost();
      const recipient = post.author; // Notify the post author
      const actor = getRandomUser(post.author.id); // Someone other than the post author

      const notification = notificationRepository.create({
        recipient: recipient,
        actor: actor,
        type: 'Reaction on Post',
        read: Math.random() > 0.5,
        resourceType: NotificationResourceType.POST,
        resourceId: post.id,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 3), // within last 3 days
      });
      notifications.push(notification);
    }
  }

  await notificationRepository.save(notifications);
  console.log(`Seeded ${notifications.length} notifications.`);
  return notifications;
}
