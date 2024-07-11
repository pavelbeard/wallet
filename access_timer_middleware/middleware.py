# from django.utils import timezone
# from django.http import JsonResponse
# from stuff.models import AccessTime
#
#
# class AccessTimerMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response
#
#     def __call__(self, request):
#         if request.path.startswith('/api/'):
#             current_time = timezone.now()
#             if request.session.get('last_access_time'):
#                 last_access_time = request.session.get('last_access_time')
#                 duration = AccessTime.load().duration
#                 if (current_time - last_access_time).total_seconds() < duration:
#                     return JsonResponse({
#                         'error': 'Access time expired'
#                     }, status=403)
#
#             request.session['last_access_time'] = current_time
#
#         response = self.get_response(request)
#         return response
